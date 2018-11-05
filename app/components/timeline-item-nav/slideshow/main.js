import {
  Promise as EmberPromise,
  resolve,
  all
} from 'rsvp';
import { isEmpty, isPresent } from '@ember/utils';
import { bind, later } from '@ember/runloop';
import { alias, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import { htmlSafe } from '@ember/string';
import TouchActionMixin from 'ember-hammertime/mixins/touch-action';
import { task, timeout } from 'ember-concurrency';
import { EKMixin, EKOnInsertMixin, keyDown } from 'ember-keyboard';

const NavState = EmberObject.extend({
  currentPanel: computed({
    get() {
      return this.get('_currentPanel');
    },
    set(key, currentPanel) {
      const previousPanel = this.get('_currentPanel');

      if (previousPanel) previousPanel.set('isOutgoing', false);
      currentPanel.set('isOutgoing', true);

      return this.set('_currentPanel', currentPanel);
    }
  }),
  incomingPanel: computed({
    get() {
      return this.get('_incomingPanel');
    },
    set(key, incomingPanel) {
      const previousPanel = this.get('_incomingPanel');

      if (previousPanel && previousPanel !== 'edge') previousPanel.set('isIncoming', false);
      if (incomingPanel && incomingPanel !== 'edge') incomingPanel.set('isIncoming', true);

      return this.set('_incomingPanel', incomingPanel);
    }
  })
});

export default Component.extend(TouchActionMixin, EKMixin, EKOnInsertMixin, {
  classNames: ['timeline-item-nav-slideshow-main'],
  attributeBindings: ['style'],

  meta: service(),
  modalManager: service(),
  usingTouch: alias('meta.usingTouch'),
  isLoadingMoreTimelineItems: notEmpty('loadingMoreTimelineItemsPromise'),

  swipeState: computed(() => { return {
    wheelX: 0,
    wheelY: 0
  }}),
  navState: computed(() => NavState.create({
    progress: 0,
    diffs: []
  })),

  scrollLeft: 0,

  defaultPanelHeight: computed(() => {
    if (document.body.clientWidth < 800) return document.body.clientWidth * 1.25;
  }),

  didInsertElement(...args) {
    this._super(...args);

    const initialTimelineItemId = this.get('initialTimelineItemId');
    let timelineItem
    if (isPresent(initialTimelineItemId)) timelineItem = this.get('decoratedTimelineItems').find((decoratedTimelineItem) => decoratedTimelineItem.model.id === initialTimelineItemId);
    if (isEmpty(timelineItem)) timelineItem = this.get('lastTimelineItem') ? this.get('decoratedTimelineItems.lastObject') : this.get('decoratedTimelineItems.firstObject');
    this._scrollToTimelineItem(timelineItem.model.id);

    const visibleTimelineItems = this._gatherVisibleTimelineItems();

    this.attrs.changeTimelineItem(visibleTimelineItems[0].model);
    this.set('navState.currentPanel', visibleTimelineItems[0].get('panels.firstObject'));
    this.set('navState.lastTimelineItem', visibleTimelineItems[visibleTimelineItems.length - 1]);

    visibleTimelineItems.forEach((timelineItem) => {
      this._loadNeighborMatrix(timelineItem.get('panels.firstObject'));
    });

    this._setupIntersectionObserver();
    this._checkNeedToLoadMoreTimelineItems();

    window.addEventListener('resize', () => {
      this.notifyPropertyChange('defaultPanelHeight');
    });
  },

  _gatherVisibleTimelineItems() {
    const slideshowBounding = this.element.getBoundingClientRect();
    const visibleTimelineItems = Array.from(this.element.querySelectorAll('.timeline-item-nav-slideshow-post')).filter((element) => {
      const bounding = element.getBoundingClientRect();

      return bounding.top >= slideshowBounding.top - 1 && (bounding.height + bounding.top >= slideshowBounding.bottom || bounding.bottom <= slideshowBounding.bottom);
    });
    const visibleTimelineItemIds = visibleTimelineItems.map((ti) => ti.dataset.timelineItemId);

    return this.decoratedTimelineItems.filter((timelineItem) => visibleTimelineItemIds.indexOf(timelineItem.model.id) > -1);
  },

  _setupIntersectionObserver() {
    const options = {
      root: document.querySelector('.timeline-item-nav-slideshow-main'),
      rootMargin: '0px',
      threshold: [0, 1]
    }
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        const id = entry.target.dataset.timelineItemId;
        const timelineItem = this.decoratedTimelineItems.find((timelineItem) => timelineItem.model.id === id);
        const currentPanel = timelineItem.get('panels.firstObject');
        this._loadNeighborMatrix(currentPanel);

        if (entry.isIntersecting && entry.boundingClientRect.y < entry.rootBounds.y) {
          this.attrs.changeTimelineItem(timelineItem.model);
          this.set('navState.currentPanel', currentPanel);
        } else if (entry.boundingClientRect.y >= entry.rootBounds.y && entry.intersectionRect.height !== entry.boundingClientRect.height && entry.intersectionRect.height !== 0) {
          this.set('navState.lastTimelineItem', timelineItem);
        }
      });

      this._checkNeedToLoadMoreTimelineItems();
    };

    this.set('intersectionObserver', new IntersectionObserver(callback, options));
  },

  _scrollToTimelineItem(id) {
    const element = this.element.querySelector(`[data-timeline-item-id="${id}"]`);
    this.element.scrollTop = element.offsetTop;
  },

  _checkNeedToLoadMoreTimelineItems() {
    const timelineItems = this.get('decoratedTimelineItems');
    const firstTimelineItem = this.get('navState.currentPanel.timelineItem');
    const lastTimelineItem = this.get('navState.lastTimelineItem');
    const firstIndex = timelineItems.indexOf(firstTimelineItem);
    const lastIndex = timelineItems.indexOf(lastTimelineItem);
    const nearingEnd = lastIndex > timelineItems.length - 5 && !this.get('reachedLastTimelineItem');
    const nearingStart = firstIndex < 5 && !this.get('reachedFirstTimelineItem');

    if ((nearingEnd || nearingStart) && !this.get('isLoadingMoreTimelineItems')) {
      const scrollHeight = this.element.scrollHeight;
      const loadingMoreTimelineItemsPromise = new EmberPromise((resolve, reject) => {
        this.attrs.loadMoreTimelineItems(resolve, reject, !nearingEnd, nearingEnd ? timelineItems.get('lastObject.model.id') : timelineItems.get('firstObject.model.id'));
      });

      this.set('loadingMoreTimelineItemsPromise', loadingMoreTimelineItemsPromise);

      loadingMoreTimelineItemsPromise.then((newProperties) => {
        this.setProperties(newProperties);
        this._loadNeighborMatrix(this.get('navState.currentPanel'));

        if (this.get('navState.incomingPanel') === 'edge') {
          this.set('navState.incomingPanel', this._getNeighbor(this.get('navState.currentPanel'), this.get('navState.direction')));
        }

        // if (nearingStart) {
        //   Ember.run.next(() => {
        //     this.element.scrollTop += this.element.scrollHeight - scrollHeight;
        //   });
        // }
      }).finally(() => {
        this.get('_completeTimelineItemLoadTask').perform();
      });
    }
  },

  _completeTimelineItemLoadTask: task(function * () {
    yield timeout(250);

    this.set('loadingMoreTimelineItemsPromise', null);
    this._checkNeedToLoadMoreTimelineItems();
  }),

  _loadNeighborMatrix: async function(panel) {
    if (!panel) return;
    panel.set('shouldLoad', true);
    await panel.get('loadPromise');
    await this._loadNeighbors(panel);
    await this._loadNeighbors(this._getNeighbor(panel, 'right'));
    await this._loadNeighbors(this._getNeighbor(panel, 'down'));
    await this._loadNeighbors(this._getNeighbor(panel, 'up'));
    await this._loadNeighbors(this._getNeighbor(panel, 'left'));
  },

  _loadNeighbors(panel) {
    if (!panel || panel === 'edge' || panel.get('hasLoadedNeighbors')) return resolve();

    const promise = all(['right', 'down', 'up', 'left'].map((direction) => {
      const neighbor = this._getNeighbor(panel, direction);

      if (neighbor === 'edge' || neighbor.get('isLoaded')) return resolve();

      neighbor.set('shouldLoad', true);

      return neighbor.get('loadPromise');
    }));

    promise.then(() => panel.set('hasLoadedNeighbors', true));

    return promise;
  },

  _getDirection(forward) {
    const horizontalSwipe = this.get('navState.axis') === 'x';

    return forward ?
      horizontalSwipe ? 'right' : 'up' :
      horizontalSwipe ? 'left': 'down';
  },

  _getNeighbor(panel, direction) {
    return panel.getNeighbor(direction);
  },

  actions: {
    openModalNav(panel) {
      this.modalManager.open('timeline-item-nav/slideshow/modal-nav', () => {}, () => {}, {
        panel,
        timelineItems: this.decoratedTimelineItems,
        scrollToTimelineItem: this._scrollToTimelineItem.bind(this)
      });
    },

    removeTimelineItem(timelineItem) {
      this.attrs.removeTimelineItem(timelineItem);
      if (this.get('navState.currentPanel').getNeighbor('up') !== 'edge') this._navUp();
      else if (this.get('navState.currentPanel').getNeighbor('down') !== 'edge') this._navDown();
    },

    toggleChat() {
      this.attrs.toggleChat();
    },

    scrollVertical(direction, timelineItemId) {
      const index = this.decoratedTimelineItems.indexOf(this.decoratedTimelineItems.find((ti) => ti.model.id.toString() === timelineItemId.toString()));
      const list = direction > 0 ? this.decoratedTimelineItems.slice(index + 1) : this.decoratedTimelineItems.slice(0, index).reverse();
      const nextTimelineItem = list.find((ti) => ti.panels.firstObject.srcset !== undefined)
      console.log(nextTimelineItem.model.id)

      this._scrollToTimelineItem(nextTimelineItem.model.id);
    },

    slidePanels(activePanels, scrollLeft) {
      this.set('activePanels', activePanels);
      this.set('scrollLeft', scrollLeft);
    }
  }
});
