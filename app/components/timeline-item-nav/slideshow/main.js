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

  panelHeight: 1800,
  panelWidth: 1440,

  meta: service(),
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

  didInsertElement(...args) {
    this._super(...args);

    this.lethargy = new Lethargy(7, 60);

    this.element.addEventListener('touchstart', bind(this, this._touchStart));
    this.element.addEventListener('touchmove', bind(this, this._touchMove), { passive: false });
    this.element.addEventListener('touchend', bind(this, this._touchEnd));
    this.element.addEventListener('wheel', bind(this, this._wheel));

    if (!this.get('usingTouch')) {
      const startEvent = bind(this, this._startEvent);
      const moveEvent = bind(this, this._moveEvent);
      const outEvent = bind(this, this._outEvent);
      const endEvent = bind(this, this._endEvent);
      const removeClickEvents = () => {
        this.set('usingTouch', true);
        this.element.removeEventListener('mousedown', startEvent);
        this.element.removeEventListener('mousemove', moveEvent);
        this.element.removeEventListener('mouseup', endEvent);
        this.element.removeEventListener('mouseout', outEvent);
        this.element.removeEventListener('touchstart', removeClickEvents);
      };

      this.element.addEventListener('mousedown', startEvent);
      this.element.addEventListener('mousemove', moveEvent);
      this.element.addEventListener('mouseout', outEvent);
      this.element.addEventListener('mouseup', endEvent);
      this.element.addEventListener('touchstart', removeClickEvents);
    }

    const initialTimelineItemId = this.get('initialTimelineItemId');
    let timelineItem
    if (isPresent(initialTimelineItemId)) timelineItem = this.get('decoratedTimelineItems').find((decoratedTimelineItem) => decoratedTimelineItem.model.id === initialTimelineItemId);
    if (isEmpty(timelineItem)) timelineItem = this.get('lastTimelineItem') ? this.get('decoratedTimelineItems.lastObject') : this.get('decoratedTimelineItems.firstObject');
    const currentPanel = timelineItem.get('panels.firstObject');

    this.attrs.changeTimelineItem(timelineItem.get('model'));
    this.set('navState.currentPanel', currentPanel);
    this.get('_loadNeighborMatrix').perform(currentPanel);
    this._boundSettle = this._settle.bind(this);
    this._boundDeterminePanelSize = this._determinePanelSize.bind(this);

    this._boundDeterminePanelSize();

    window.addEventListener('resize', this._boundDeterminePanelSize);
  },

  willDestroyElement() {
    window.removeEventListener('resize', this._boundDeterminePanelSize);

    return this._super(...arguments);
  },

  _determinePanelSize() {
    const useDesktopView = this.element.parentElement.clientWidth > 1000
    const naturalPanelHeight = this.element.parentElement.clientHeight;
    const idealPanelHeight = useDesktopView ? naturalPanelHeight : naturalPanelHeight - 130;
    const ratio = 4 / 5;

    if (this.element.parentElement.clientWidth / idealPanelHeight >= ratio) {
      this.set('panelHeight', Math.min(idealPanelHeight, 1800));
      this.set('panelWidth', this.panelHeight * ratio);
    } else {
      this.set('panelWidth', Math.min(this.element.parentElement.clientWidth, 1440));
      this.set('panelHeight', this.panelWidth * (1 / ratio));
    }

    if (useDesktopView) {
      this.set('style', htmlSafe(`height: ${this.get('panelHeight')}px;`));
    } else {
      this.set('style', undefined);
    }
  },

  _navDown: on(keyDown('shift+ArrowDown'), function() {
    if (this.get('chatIsOpen')) return;

    this._manualNav('down', 'y', -1);
  }),

  _navLeft: on(keyDown('shift+ArrowLeft'), function() {
    this._manualNav('left', 'x', -1);
  }),

  _navRight: on(keyDown('shift+ArrowRight'), function() {
    this._manualNav('right', 'x', 1);
  }),

  _navUp: on(keyDown('shift+ArrowUp'), function() {
    if (this.get('chatIsOpen')) return;

    this._manualNav('up', 'y', 1);
  }),

  _manualNav(direction, axis, velocityDirection) {
    const navState = this.get('navState');
    const progress = navState.get('progress');

    if (progress === 0 && this._getNeighbor(navState.get('currentPanel'), direction) !== 'edge') {
      this._swapPeek(navState.set('progress', 0.001 * velocityDirection), direction);
      navState.set('axis', axis);
    }

    if (navState.get('axis') === axis) {
      const hadBeenSettling = navState.get('isSettling');

      navState.setProperties({
        diffs: [],
        isSettling: true
      });

      if (velocityDirection === -1) {
        navState.get('progress') > 0 ? navState.set('velocity', -0.01) : navState.incrementProperty('velocity', -0.03);
      } else {
        navState.get('progress') < 0 ? navState.set('velocity', 0.01) : navState.incrementProperty('velocity', 0.03);
      }


      if (!hadBeenSettling) this._settle();
    }
  },

  _touchStart(e) {
    this._startEvent(e.changedTouches[0]);
  },

  _touchMove(e) {
    if (!this.get('chatIsOpen')) e.preventDefault();
    this._moveEvent(e.changedTouches[0]);
  },

  _touchEnd(e) {
    this._endEvent(e.changedTouches[0]);
  },

  _wheel(e) {
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 && this.lethargy.check(e) === false) return;

    const swipeState = this.get('swipeState');
    const event = {
      deltaX: e.deltaX !== 0 && Math.abs(e.deltaX) === 1 ? 66 * Math.sign(e.deltaX) : -e.deltaX,
      deltaY: e.deltaY !== 0 && Math.abs(e.deltaY) === 3 ? 66 * Math.sign(e.deltaY) : -e.deltaY
    };

    if (!swipeState.active) this._startEvent(event, { usingWheel: true });
    this._moveEvent(event);
    this.get('_wheelEndTask').perform(event);
  },

  _wheelEndTask: task(function * (event) {
    yield timeout(100);

    this._endEvent(event);
  }).restartable(),

  _startEvent(e, options = {}) {
    const swipeState = this.get('swipeState');

    swipeState.diffX = 0;
    swipeState.diffY = 0;
    swipeState.startX = e.clientX;
    swipeState.startY = e.clientY;
    swipeState.currentX = e.clientX;
    swipeState.currentY = e.clientY;
    swipeState.active = true;
    swipeState.firstMoveEventPassed = false;
    swipeState.swapLock = 250;
    swipeState.wheelY = 0;
    swipeState.wheelX = 0;
    swipeState.usingWheel = options.usingWheel;

    if (this.get('navState.isSettling')) {
      this.set('navState.isSettling', false);
    } else {
      swipeState.locked = true;
      swipeState.lockedX = 0;
      swipeState.lockedY = 0;
    }
  },

  _moveEvent(e) {
    const swipeState = this.get('swipeState');
    if (!swipeState.active || (swipeState.usingWheel && e.type === 'mousemove')) return;

    // in case it's activated by a swipe event from a child, such as the text swipe
    if (swipeState.firstMoveEventPassed) {
      swipeState.diffX = e.deltaX !== undefined ? e.deltaX : swipeState.currentX - e.clientX;
      swipeState.diffY = e.deltaY !== undefined ? e.deltaY : e.clientY - swipeState.currentY;
    } else {
      swipeState.firstMoveEventPassed = true;
    }
    swipeState.currentX = e.clientX;
    swipeState.currentY = e.clientY;

    const navState = this.get('navState');

    if (swipeState.locked) {
      swipeState.lockedX += swipeState.diffX;
      swipeState.lockedY += swipeState.diffY;

      const threshold = 5;

      if (Math.abs(swipeState.lockedX) > threshold && Math.abs(swipeState.lockedX) >= Math.abs(swipeState.lockedY)) {
        navState.set('axis', 'x');
        swipeState.locked = false;
      } else if (!this.get('chatIsOpen') && Math.abs(swipeState.lockedY) > threshold && Math.abs(swipeState.lockedY) > Math.abs(swipeState.lockedX)) {
        navState.set('axis', 'y');
        swipeState.locked = false;
      } else {
        return;
      }
    }

    const previousProgress = navState.get('progress');
    const horizontalNav = navState.get('axis') === 'x';

    const percentChange = horizontalNav ? (swipeState.diffX / window.innerWidth) : (swipeState.diffY / window.innerHeight);
    const progress = previousProgress + percentChange;
    navState.get('diffs').push(percentChange);

    const isVerticalSwipe = this.get('navState.axis') === 'y';

    if (progress >= 1) {
      this._startNextPeek(progress - 1, this._getDirection(true));
    } else if (progress <= -1) {
      this._startNextPeek(progress + 1, this._getDirection(false));
    } else if (previousProgress >= 0 && progress < 0) {
      if (isVerticalSwipe && Math.abs(swipeState.swapLock) < 250) {
        swipeState.swapLock += swipeState.diffY;
      } else this._swapPeek(progress, this._getDirection(false));
    } else if (previousProgress < 0 && progress >= 0) {
      if (isVerticalSwipe && Math.abs(swipeState.swapLock) < 250) {
        swipeState.swapLock += swipeState.diffY;
      } else this._swapPeek(progress, this._getDirection(true));
    } else if (!this.get('navState.incomingPanel')) {
      if (isVerticalSwipe && Math.abs(swipeState.swapLock) < 250) {
        swipeState.swapLock += swipeState.diffY;
      } else this._swapPeek(progress, previousProgress > progress ? this._getDirection(false) : this._getDirection(true));
    } else {
      navState.set('progress', progress);
    }
  },

  _outEvent(e) {
    if (!this.element.contains(e.toElement || e.relatedTarget)) this._endEvent(e);
  },

  _endEvent(e) {
    const swipeState = this.get('swipeState');
    if (!swipeState.active) return;

    const navState = this.get('navState');
    swipeState.diffX = e.deltaX !== undefined ? e.deltaX : swipeState.currentX - e.clientX;
    swipeState.diffY =  e.deltaY !== undefined ? e.deltaY : e.clientY - swipeState.currentY;
    swipeState.currentX = e.clientX;
    swipeState.currentY = e.clientY;
    swipeState.active = false;

    const diffs = navState.get('diffs');
    const precision = 5;
    const latestDiffs = diffs.slice(Math.max(0, diffs.length - precision), diffs.length);
    const progress = navState.get('progress');
    let velocity = progress > 0.5 ? 0.01 : -0.01;
    if (latestDiffs.length > 0) velocity = latestDiffs.reduce((sum, diff) => sum + diff, 0) / Math.min(latestDiffs.length, precision);
    velocity = velocity < 0 ? Math.min(velocity, -0.01) : Math.max(0.01, velocity);

    const notReversingMidSwipe = Math.sign(velocity) === Math.sign(progress);
    const wasSwipingTowardsEdge = navState.get('incomingPanel') === 'edge';
    const stillSwipingTowardsEdge = this._getNeighbor(
      navState.get('currentPanel'),
      velocity < 0
        ? this._getDirection(false)
        : this._getDirection(true)
      ) === 'edge';

    if (wasSwipingTowardsEdge && stillSwipingTowardsEdge && notReversingMidSwipe) velocity *= -1;

    navState.setProperties({
      diffs: [],
      velocity,
      isSettling: true
    });

    this._settle();
  },

  _settle() {
    if (isEmpty(this.element)) return;

    const navState = this.get('navState');
    const previousProgress = navState.get('progress');
    let progress = previousProgress + navState.get('velocity');

    if (progress > 1 || progress < -1) {
      this._startNextPeek(0, progress <= 1 ? this._getDirection(false) : this._getDirection(true));
      navState.setProperties({
        isSettling: false,
        incomingPanel: null,
        axis: null,
        velocity: 0
      });
    } else if ((previousProgress >= 0 && progress < 0) || (previousProgress < 0 && progress >= 0)) {
      navState.setProperties({
        isSettling: false,
        progress: 0,
        incomingPanel: null,
        axis: null,
        velocity: 0
      });
    } else if (navState.get('isSettling')) {
      navState.set('progress', progress);
      requestAnimationFrame(this._boundSettle);
    }
  },

  _startNextPeek(progress, direction) {
    const navState = this.get('navState');
    const previousPanel = navState.get('currentPanel');
    const currentPanel = this._getNeighbor(previousPanel, direction);

    if (currentPanel !== 'edge') {
      const prerender = (panel, direction, prerender) => {
        const neighbor = this._getNeighbor(panel, direction);

        if (neighbor !== 'edge') neighbor.set('timelineItem.shouldPrerender', prerender);
      }

      prerender(previousPanel, 'up', false);
      prerender(previousPanel, 'down', false);
      prerender(currentPanel, 'up', true);
      prerender(currentPanel, 'down', true);

      const incomingPanel = this._getNeighbor(currentPanel, direction);

      navState.setProperties({
        progress,
        currentPanel,
        incomingPanel,
        direction
      });

      this.attrs.changeTimelineItem(currentPanel.get('timelineItem.model'));
      this.get('_loadNeighborMatrix').perform(currentPanel);
      this._checkNeedToLoadMoreTimelineItems();
    }
  },

  _swapPeek(progress, direction) {
    const currentPanel = this.get('navState.currentPanel');
    const incomingPanel = this._getNeighbor(currentPanel, direction);

    this.get('navState').setProperties({
      progress,
      incomingPanel
    });

    this.set('swipeState.swapLock', 0);
  },

  _checkNeedToLoadMoreTimelineItems() {
    const timelineItems = this.get('decoratedTimelineItems');
    const currentTimelineItem = this.get('navState.currentPanel.timelineItem');
    const index = timelineItems.indexOf(currentTimelineItem);
    const nearingEnd = index > timelineItems.length - 3;

    if (((nearingEnd && !this.get('reachedLastTimelineItem')) || (index < 2 && !this.get('reachedFirstTimelineItem'))) && !this.get('isLoadingMoreTimelineItems')) {
      const loadingMoreTimelineItemsPromise = new EmberPromise((resolve, reject) => {
        this.attrs.loadMoreTimelineItems(resolve, reject, !nearingEnd, nearingEnd ? timelineItems.get('lastObject.model.id') : timelineItems.get('firstObject.model.id'));
      });

      this.set('loadingMoreTimelineItemsPromise', loadingMoreTimelineItemsPromise);

      loadingMoreTimelineItemsPromise.then((newProperties) => {
        this.setProperties(newProperties);
        this.get('_loadNeighborMatrix').perform(this.get('navState.currentPanel'));

        if (this.get('navState.incomingPanel') === 'edge') {
          this.set('navState.incomingPanel', this._getNeighbor(this.get('navState.currentPanel'), this.get('navState.direction')));
        }
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

  _loadNeighborMatrix: task(function * (panel) {
    panel.set('shouldLoad', true);
    yield panel.get('loadPromise');
    yield this._loadNeighbors(panel);
    yield this._loadNeighbors(this._getNeighbor(panel, 'right'));
    yield this._loadNeighbors(this._getNeighbor(panel, 'down'));
    yield this._loadNeighbors(this._getNeighbor(panel, 'up'));
    yield this._loadNeighbors(this._getNeighbor(panel, 'left'));
  }).restartable(),

  _loadNeighbors(panel) {
    if (panel === 'edge' || panel.get('hasLoadedNeighbors')) return resolve();

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
    removeTimelineItem(timelineItem) {
      this.attrs.removeTimelineItem(timelineItem);
      if (this.get('navState.currentPanel').getNeighbor('up') !== 'edge') this._navUp();
      else if (this.get('navState.currentPanel').getNeighbor('down') !== 'edge') this._navDown();
    },

    toggleChat() {
      this.attrs.toggleChat();
    }
  }
});
