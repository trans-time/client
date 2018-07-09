import Component from '@ember/component';
import { A } from '@ember/array';
import { on } from '@ember/object/evented';
import EmberObject, { computed, observer } from '@ember/object';
import { alias, oneWay, equal, sort } from '@ember/object/computed';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isBlank, isEmpty, isPresent } from '@ember/utils';

const PanelDecorator = EmberObject.extend({
  isLoaded: alias('model.srcIsLoaded'),
  shouldLoad: alias('model.srcShouldLoad'),
  loadPromise: alias('model.loadPromise'),

  postNavComponent: oneWay('model.postNavComponent'),
  srcset: oneWay('model.srcset'),

  getNeighbor(direction) {
    return this.get(direction) || this.resetNeighbor(direction);
  },

  resetNeighbor(direction) {
    const index = this.get('index');
    switch(direction) {
      case 'right': return this.set(direction, this._getHorizontalNeighbor(index + 1, 'firstObject'));
      case 'left': return this.set(direction, this._getHorizontalNeighbor(index - 1, 'lastObject'));
      default: {
        const timelineItem = this.get('timelineItem').getNeighbor(direction);

        if (isBlank(timelineItem)) return 'edge';

        const panels = timelineItem.get('panels');

        return this.set(direction, panels[index] || panels.get('firstObject'));
      }
    }
  },

  _getHorizontalNeighbor(index, wrapIndex) {
    const timelineItem = this.get('timelineItem');

    return timelineItem.get('panels.length') === 1 ? 'edge' : timelineItem.get('panels')[index] || timelineItem.get(`panels.${wrapIndex}`);
  }
});

const TimelineItemDecorator = EmberObject.extend({
  timelineItems: oneWay('component.decoratedTimelineItems'),
  isBlank: equal('model.timelineable.panels.length', 0),

  isIncoming: computed('panels.@each.isIncoming', {
    get() {
      return this.get('panels').any((panel) => panel.get('isIncoming'));
    }
  }),

  isOutgoing: computed('panels.@each.isOutgoing', {
    get() {
      return this.get('panels').any((panel) => panel.get('isOutgoing'));
    }
  }),

  panels: computed('model.timelineable.panels.[]', {
    get() {
      const isModerating = this.get('component.isModerating');
      let panels = this.get('model.timelineable.panels');

      if (isEmpty(panels)) panels = [this.get('_blankPanel')];

      return panels.toArray().filter((panel) => isModerating || !panel.get('isMarkedForDeletion')).sort((a, b) => a.get('order') - b.get('order')).map((model, index) => {
        return PanelDecorator.create({
          model,
          index,
          timelineItem: this
        })
      });
    }
  }),

  getNeighbor(direction) {
    return this.get(direction) || this.resetNeighbor(direction);
  },

  resetNeighbor(direction) {
    const index = this.get('timelineItems').indexOf(this);

    switch(direction) {
      case 'up': return this.set(direction, this.get('timelineItems')[index - 1]);
      case 'down': return this.set(direction, this.get('timelineItems')[index + 1]);
    }
  },

  _blankPanel: computed({
    get() {
      return EmberObject.create({ postNavComponent: 'timeline-item-nav/slideshow/post/blank', timelineItem: { content: this.get('model') } });
    }
  })
});

export default Component.extend({
  classNames: ['timeline-item-nav'],
  classNameBindings: ['chatIsOpen'],

  nextTimelineItemIndex: 0,

  messageBus: service(),
  topBarManager: service(),

  decoratedTimelineItems: computed(() => A()),

  timelineItems: computed('timelineItem', {
    get() {
      const timelineItem = this.get('timelineItem');

      return A([this.get('timelineItem')]);
    }
  }),

  init(...args) {
    this._super(...args);

    this.get('messageBus').subscribe('closeComments', this, this._toggleComments);
  },

  didReceiveAttrs(...args) {
    this._super(...args);

    if (this.get('commentsAreOpen')) {
      this.set('chatIsOpen', true);
      next(() => this.get('topBarManager').showCloseComments());
    } else {
      this.set('chatIsOpen', false);
      if (this.get('topBarManager.state.showingCloseComments')) next(() => this.get('topBarManager').restorePreviousState());
    }
  },

  addTodecoratedTimelineItems: on('init', observer('timelineItems.[]', function() {
    const { decoratedTimelineItems, timelineItems, nextTimelineItemIndex } = this.getProperties('decoratedTimelineItems', 'timelineItems', 'nextTimelineItemIndex');
    if (!timelineItems || decoratedTimelineItems.get('length') > timelineItems.get('length') || timelineItems.get('length') === 0) {
      return;
    }
    const newTimelineItems = timelineItems.slice(nextTimelineItemIndex).sort((a, b) => {
      const aDate = a.get('date');
      const bDate = b.get('date');
      return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
    }).map((model, index) => {
      return TimelineItemDecorator.create({
        model,
        component: this
      });
    });

    if (newTimelineItems.get('length') === 0) return;

    decoratedTimelineItems.get('lastObject.model.date') > newTimelineItems[0].get('model.date') ? decoratedTimelineItems.pushObjects(newTimelineItems) : decoratedTimelineItems.unshiftObjects(newTimelineItems);

    this.set('nextTimelineItemIndex', timelineItems.get('length'));
  })),

  _toggleComments() {
    this.toggleProperty('chatIsOpen');

    if (this.get('chatIsOpen')) {
      this.attrs.openComments();
    } else {
      this.attrs.closeComments();
    }
  },

  actions: {
    changeTimelineItem(timelineItem) {
      this.set('timelineItem', timelineItem);
      this.attrs.changeTimelineItem(timelineItem);
    },

    loadMoreTimelineItems(...args) {
      this.sendAction('action', ...args);
    },

    removeTimelineItem(timelineItem) {
      const upNeighbor = timelineItem.getNeighbor('up');
      const downNeighbor = timelineItem.getNeighbor('down');
      this.get('decoratedTimelineItems').removeObject(timelineItem);

      if (isPresent(upNeighbor) && upNeighbor !== 'edge') {
        upNeighbor.resetNeighbor('down');
        upNeighbor.get('panels').forEach((panel) => panel.resetNeighbor('down'));
      }
      if (isPresent(downNeighbor) && downNeighbor !== 'edge') {
        downNeighbor.resetNeighbor('up');
        downNeighbor.get('panels').forEach((panel) => panel.resetNeighbor('up'));
      }

      this.decrementProperty('nextTimelineItemIndex');
    },

    toggleChat() {
      this._toggleComments();
    }
  }
});
