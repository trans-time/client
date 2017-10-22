import Ember from 'ember';
import TouchActionMixin from 'ember-hammertime/mixins/touch-action';
import { task } from 'ember-concurrency';

const NavState = Ember.Object.extend({
  currentPanel: Ember.computed({
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
  incomingPanel: Ember.computed({
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

export default Ember.Component.extend(TouchActionMixin, {
  classNames: ['post-nav-slideshow-main'],
  classNameBindings: ['textExpanded:compressed'],

  meta: Ember.inject.service(),
  usingTouch: Ember.computed.alias('meta.usingTouch'),
  isLoadingMorePosts: Ember.computed.notEmpty('loadingMorePostsPromise'),

  pointers: Ember.computed(() => { return {} }),
  swipeState: Ember.computed(() => { return { }}),
  navState: Ember.computed(() => NavState.create({
    progress: 0,
    diffs: []
  })),

  textExpanded: false,

  didInsertElement(...args) {
    this._super(...args);

    this.element.addEventListener('touchstart', Ember.run.bind(this, this._touchStart));
    this.element.addEventListener('touchmove', Ember.run.bind(this, this._touchMove));
    this.element.addEventListener('touchend', Ember.run.bind(this, this._touchEnd));

    if (!this.get('usingTouch')) {
      const startEvent = Ember.run.bind(this, this._startEvent);
      const moveEvent = Ember.run.bind(this, this._moveEvent);
      const endEvent = Ember.run.bind(this, this._endEvent);
      const removeClickEvents = () => {
        this.set('usingTouch', true);
        this.element.removeEventListener('mousedown', startEvent);
        this.element.removeEventListener('mousemove', moveEvent);
        this.element.removeEventListener('mouseup', endEvent);
        this.element.removeEventListener('mouseout', endEvent);
        this.element.removeEventListener('touchstart', removeClickEvents);
      };

      this.element.addEventListener('mousedown', startEvent);
      this.element.addEventListener('mousemove', moveEvent);
      this.element.addEventListener('mouseout', endEvent);
      this.element.addEventListener('mouseup', endEvent);
      this.element.addEventListener('touchstart', removeClickEvents);
    }

    const post = this.get('decoratedPosts.firstObject');
    const currentPanel = post.get('panels.firstObject');

    this.attrs.changePost(post.get('model'));
    this.set('navState.currentPanel', currentPanel);
    this.get('_loadNeighborMatrix').perform(currentPanel);
    this._displayPointers();
    this._boundSettle = this._settle.bind(this);
  },

  _touchStart(e) {
    this._startEvent(e.changedTouches[0]);
  },

  _touchMove(e) {
    this._moveEvent(e.changedTouches[0]);
  },

  _touchEnd(e) {
    this._endEvent(e.changedTouches[0]);
  },

  _startEvent(e) {
    const swipeState = this.get('swipeState');

    swipeState.diffX = 0;
    swipeState.diffY = 0;
    swipeState.startX = e.clientX;
    swipeState.startY = e.clientY;
    swipeState.currentX = e.clientX;
    swipeState.currentY = e.clientY;
    swipeState.active = true;

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
    if (!swipeState.active) return;

    swipeState.diffX = swipeState.currentX - e.clientX;
    swipeState.diffY = e.clientY - swipeState.currentY;
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
      } else if (Math.abs(swipeState.lockedY) > threshold && Math.abs(swipeState.lockedY) > Math.abs(swipeState.lockedX)) {
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

    if (progress >= 1) {
      this._startNextPeek(progress - 1, this._getDirection(true));
    } else if (progress <= -1) {
      this._startNextPeek(progress + 1, this._getDirection(false));
    } else if (previousProgress >= 0 && progress < 0) {
      this._swapPeek(progress, this._getDirection(false));
    } else if (previousProgress < 0 && progress >= 0) {
      this._swapPeek(progress, this._getDirection(true));
    } else if (!this.get('navState.incomingPanel')) {
      this._swapPeek(progress, previousProgress > progress ? this._getDirection(false) : this._getDirection(true));
    } else {
      navState.set('progress', progress);
    }
  },

  _endEvent(e) {
    const swipeState = this.get('swipeState');
    if (!swipeState.active) return;

    swipeState.diffX = swipeState.currentX - e.clientX;
    swipeState.diffY = e.clientY - swipeState.currentY;
    swipeState.currentX = e.clientX;
    swipeState.currentY = e.clientY;
    swipeState.active = false;

    const navState = this.get('navState');
    const diffs = navState.get('diffs');
    const precision = 5;
    const latestDiffs = diffs.slice(Math.max(0, diffs.length - precision), diffs.length);
    let velocity = navState.get('progress') > 0.5 ? 0.001 : -0.001;
    if (latestDiffs.length > 0) velocity = latestDiffs.reduce((sum, diff) => sum + diff, 0) / Math.min(latestDiffs.length, precision);
    if (navState.get('incomingPanel') === 'edge' && this._getNeighbor(navState.get('currentPanel'), velocity < 0 ? this._getDirection(false) : this._getDirection(true)) === 'edge') velocity *= -1;

    navState.setProperties({
      diffs: [],
      velocity,
      isSettling: true
    });

    this._settle();
  },

  _settle() {
    if (Ember.isEmpty(this.element)) return;

    const navState = this.get('navState');
    const previousProgress = navState.get('progress');
    let progress = previousProgress + navState.get('velocity');

    if (progress > 1 || progress < -1) {
      this._startNextPeek(0, progress <= 1 ? this._getDirection(false) : this._getDirection(true));
      navState.setProperties({
        isSettling: false,
        incomingPanel: null,
        axis: null
      });
    } else if ((previousProgress >= 0 && progress < 0) || (previousProgress < 0 && progress >= 0)) {
      navState.setProperties({
        isSettling: false,
        progress: 0,
        incomingPanel: null,
        axis: null
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

        if (neighbor !== 'edge') neighbor.set('post.shouldPrerender', prerender);
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

      this.attrs.changePost(currentPanel.get('post.model'));
      this.get('_loadNeighborMatrix').perform(currentPanel);
      this._displayPointers();
      this._checkNeedToLoadMorePosts();
    }
  },

  _swapPeek(progress, direction) {
    const currentPanel = this.get('navState.currentPanel');
    const incomingPanel = this._getNeighbor(currentPanel, direction);

    this.get('navState').setProperties({
      progress,
      incomingPanel
    });
  },

  _checkNeedToLoadMorePosts() {
    const posts = this.get('decoratedPosts');
    const currentPost = this.get('navState.currentPanel.post');

    if (posts.indexOf(currentPost) > posts.length - 5 && !this.get('isLoadingMorePosts') && !this.get('reachedLastPost')) {
      const loadingMorePostsPromise = new Ember.RSVP.Promise((resolve, reject) => {
        this.attrs.loadMorePosts(resolve, reject);
      });

      this.set('loadingMorePostsPromise', loadingMorePostsPromise);

      loadingMorePostsPromise.then((reachedLastPost) => {
        this.set('reachedLastPost', reachedLastPost);
        this.get('_loadNeighborMatrix').perform(this.get('navState.currentPanel'));

        if (this.get('navState.incomingPanel') === 'edge') {
          this.set('navState.incomingPanel', this._getNeighbor(this.get('navState.currentPanel'), this.get('navState.direction')));
        }
      }).finally(() => {
        this.set('loadingMorePostsPromise', null);
        this._checkNeedToLoadMorePosts();
        this._displayPointers();
      });
    }
  },

  _displayPointers() {
    const currentPanel = this.get('navState.currentPanel');

    this.set('pointers', {
      up: this._getNeighbor(currentPanel, 'up') === 'edge' ? '' : 'chevron-up',
      right: this._getNeighbor(currentPanel, 'right') === 'edge' ? '' : 'chevron-right',
      down: this._getNeighbor(currentPanel, 'down') === 'edge' ? this.get('isLoadingMorePosts') ? 'circle-o-notch' : '' : 'chevron-down',
      left: this._getNeighbor(currentPanel, 'left') === 'edge' ? '' : 'chevron-left'
    });
  },

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
    if (panel === 'edge' || panel.get('hasLoadedNeighbors')) return Ember.RSVP.resolve();

    const promise = Ember.RSVP.all(['right', 'down', 'up', 'left'].map((direction) => {
      const neighbor = this._getNeighbor(panel, direction);

      if (neighbor === 'edge' || neighbor.get('isLoaded')) return Ember.RSVP.resolve();

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
    expandText() {
      this.set('textExpanded', true);
    },

    compressText() {
      this.set('textExpanded', false);
    }
  }
});
