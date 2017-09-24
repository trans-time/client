import Ember from 'ember';
import TouchActionMixin from 'ember-hammertime/mixins/touch-action';
import { task } from 'ember-concurrency';

const NavState = Ember.Object.extend({
  currentImage: Ember.computed({
    get() {
      return this.get('_currentImage');
    },
    set(key, currentImage) {
      const previousImage = this.get('_currentImage');

      if (previousImage) previousImage.set('isCurrentImage', false);
      currentImage.set('isCurrentImage', true);

      return this.set('_currentImage', currentImage);
    }
  }),
  incomingImage: Ember.computed({
    get() {
      return this.get('_incomingImage');
    },
    set(key, incomingImage) {
      const previousImage = this.get('_incomingImage');

      if (previousImage && previousImage !== 'edge') previousImage.set('isIncomingImage', false);
      if (incomingImage && incomingImage !== 'edge') incomingImage.set('isIncomingImage', true);

      return this.set('_incomingImage', incomingImage);
    }
  })
});

export default Ember.Component.extend(TouchActionMixin, {
  classNames: ['timeline-ui'],

  meta: Ember.inject.service(),
  usingTouch: Ember.computed.alias('meta.usingTouch'),

  pointers: Ember.computed(() => { return {} }),
  swipeState: Ember.computed(() => { return {} }),
  navState: Ember.computed(() => NavState.create({
    progress: 0,
    diffs: []
  })),

  filteredPosts: Ember.computed('posts', 'tag', {
    get() {
      const { posts, tag } = this.getProperties('posts', 'tag');

      return Ember.isEmpty(tag) ? posts.toArray() : posts.filter((postModel) => {
        return postModel.get('tags').toArray().any((tagModel) => tagModel.get('name') === tag);
      });
    }
  }),

  orderedPosts: Ember.computed('direction', 'filteredPosts', {
    get() {
      const { direction, filteredPosts } = this.getProperties('direction', 'filteredPosts');

      return filteredPosts.sort((a, b) => {
        return direction === 'desc' ? b.get('date') - a.get('date') : a.get('date') - b.get('date');
      });
    }
  }),

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

    const currentImage = this.get('orderedPosts.firstObject.images.firstObject');

    this.set('navState.currentImage', currentImage);
    this.get('_loadNeighborMatrix').perform(currentImage);
    this._displayPointers();
    this.attrs.changePost(currentImage.get('post.content'));
  },

  willDestroyElement(...args) {
    this._super(...args);

    const { currentImage, incomingImage } = this.get('navState').getProperties('currentImage', 'incomingImage');

    currentImage.set('isCurrentImage', false);
    if (incomingImage) incomingImage.set('isIncomingImage', false);
  },

  _touchStart(e) {
    this._startEvent(e.changedTouches[0]);
    e.preventDefault();
  },

  _touchMove(e) {
    this._moveEvent(e.changedTouches[0]);
    e.preventDefault();
  },

  _touchEnd(e) {
    this._endEvent(e.changedTouches[0]);
    e.preventDefault();
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

    const navState = this.get('navState');

    navState.setProperties({
      isSettling: false,
      userHasInteracted: true
    });
  },

  _moveEvent(e) {
    const swipeState = this.get('swipeState');
    if (!swipeState.active) return;

    swipeState.diffX = swipeState.currentX - e.clientX;
    swipeState.diffY = e.clientY - swipeState.currentY;
    swipeState.currentX = e.clientX;
    swipeState.currentY = e.clientY;

    const navState = this.get('navState');
    const previousProgress = navState.get('progress');
    const horizontalNav = (navState.get('axis') || navState.set('axis', Math.abs(swipeState.diffX) > Math.abs(swipeState.diffY) ? 'x' : 'y')) === 'x';

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
    } else if (!this.get('navState.incomingImage')) {
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
    if (latestDiffs.length > 0) {
      let velocity = latestDiffs.reduce((sum, diff) => sum + diff, 0) / Math.min(latestDiffs.length, precision);
      velocity = velocity > 0 ? Math.max(0.001, Math.min(0.03, velocity)) : Math.min(-0.001, Math.max(-0.03, velocity));
      if (navState.get('incomingImage') === 'edge' && this._getNeighbor(navState.get('currentImage'), velocity < 0 ? this._getDirection(false) : this._getDirection(true)) === 'edge') velocity *= -1;

      navState.setProperties({
        diffs: [],
        velocity,
        isSettling: true
      });

      this._settle();
    }
  },

  _settle() {
    const navState = this.get('navState');
    const previousProgress = navState.get('progress');
    let progress = previousProgress + navState.get('velocity');

    if (progress > 1 || progress < -1) {
      this._startNextPeek(0, progress <= 1 ? this._getDirection(false) : this._getDirection(true));
      navState.setProperties({
        isSettling: false,
        incomingImage: null,
        axis: null
      });
    } else if ((previousProgress >= 0 && progress < 0) || (previousProgress < 0 && progress >= 0)) {
      navState.setProperties({
        isSettling: false,
        progress: 0,
        incomingImage: null,
        axis: null
      });
    } else if (navState.get('isSettling')) {
      navState.set('progress', progress);
      requestAnimationFrame(this._settle.bind(this));
    }
  },

  _startNextPeek(progress, direction) {
    const navState = this.get('navState');
    const currentImage = this._getNeighbor(navState.get('currentImage'), direction);

    if (currentImage !== 'edge') {
      const incomingImage = this._getNeighbor(currentImage, direction);

      navState.setProperties({
        progress,
        currentImage,
        incomingImage
      });

      this.attrs.changePost(currentImage.get('post.content'));
      this.get('_loadNeighborMatrix').perform(currentImage);
      this._displayPointers();
    }
  },

  _swapPeek(progress, direction) {
    const currentImage = this.get('navState.currentImage');
    const incomingImage = this._getNeighbor(currentImage, direction);

    this.get('navState').setProperties({
      progress,
      incomingImage
    });
  },

  _displayPointers() {
    const currentImage = this.get('navState.currentImage');

    this.set('pointers', {
      up: this._getNeighbor(currentImage, 'up') === 'edge',
      right: this._getNeighbor(currentImage, 'right') === 'edge',
      down: this._getNeighbor(currentImage, 'down') === 'edge',
      left: this._getNeighbor(currentImage, 'left') === 'edge'
    });
  },

  _loadNeighborMatrix: task(function * (image) {
    image.set('shouldLoad', true);
    yield image.get('loadPromise');
    yield this._loadNeighbors(image);
    yield this._loadNeighbors(this._getNeighbor(image, 'right'));
    yield this._loadNeighbors(this._getNeighbor(image, 'down'));
    yield this._loadNeighbors(this._getNeighbor(image, 'up'));
    yield this._loadNeighbors(this._getNeighbor(image, 'left'));
  }).restartable(),

  _loadNeighbors(image) {
    if (image === 'edge') return Ember.RSVP.resolve();

    return Ember.RSVP.all(['right', 'down', 'up', 'left'].map((direction) => {
      const neighbor = this._getNeighbor(image, direction);

      if (neighbor === 'edge' || neighbor.get('isLoaded')) return Ember.RSVP.resolve();

      neighbor.set('shouldLoad', true);

      return neighbor.get('loadPromise');
    }));
  },

  _getDirection(forward) {
    const horizontalSwipe = this.get('navState.axis') === 'x';

    return forward ?
      horizontalSwipe ? 'right' : 'up' :
      horizontalSwipe ? 'left': 'down';
  },

  _getNeighbor(image, direction) {
    const orderedPosts = this.get('orderedPosts');
    const post = image.get('post.content');
    const xIndex = orderedPosts.indexOf(post);
    const yIndex = post.get('images').indexOf(image);

    switch(direction) {
      case 'right': return this._getHorizontalNeighbor(post, yIndex + 1, 'firstObject');
      case 'left': return this._getHorizontalNeighbor(post, yIndex - 1, 'lastObject');
      case 'up': return this._getVerticalNeighbor(xIndex - 1, yIndex);
      case 'down': return this._getVerticalNeighbor(xIndex + 1, yIndex);
    }
  },

  _getHorizontalNeighbor(post, yIndex, wrapIndex) {
    return post.get('images').toArray()[yIndex] || post.get(`images.${wrapIndex}`);

  },

  _getVerticalNeighbor(xIndex, yIndex) {
    const post = this.get('orderedPosts')[xIndex];

    return post ? post.get('images').toArray()[yIndex] || post.get('images.lastObject') : 'edge';
  }
});
