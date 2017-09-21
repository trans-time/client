import Ember from 'ember';
import TouchActionMixin from 'ember-hammertime/mixins/touch-action';

export default Ember.Component.extend(TouchActionMixin, {
  classNames: ['timeline-container'],

  swipeState: Ember.computed(() => { return {} }),
  navState: Ember.computed(() => Ember.Object.create({
    progress: 0,
    diffs: [],
    horizontalSwipe: null
  })),

  initialPost: Ember.computed.oneWay('orderedPosts.firstObject'),
  store: Ember.inject.service(),

  _touchStart(e) {
    this._startEvent(e.changedTouches[0]);
    e.preventDefault();
  },

  _startEvent(e) {
    this.swipeState.diffX = 0;
    this.swipeState.diffY = 0;
    this.swipeState.startX = e.clientX;
    this.swipeState.startY = e.clientY;
    this.swipeState.currentX = e.clientX;
    this.swipeState.currentY = e.clientY;
    this.swipeState.active = true;

    this._swipeStart();
  },

  _touchMove(e) {
    this._moveEvent(e.changedTouches[0]);
    e.preventDefault();
  },

  _moveEvent(e) {
    if (!this.swipeState.active) return;

    this.swipeState.diffX = this.swipeState.currentX - e.clientX;
    this.swipeState.diffY = e.clientY - this.swipeState.currentY;
    this.swipeState.currentX = e.clientX;
    this.swipeState.currentY = e.clientY;

    this._swipeMove();
  },

  _touchEnd(e) {
    this._endEvent(e.changedTouches[0]);
    e.preventDefault();
  },

  _endEvent(e) {
    if (!this.swipeState.active) return;

    this.swipeState.diffX = this.swipeState.currentX - e.clientX;
    this.swipeState.diffY = e.clientY - this.swipeState.currentY;
    this.swipeState.currentX = e.clientX;
    this.swipeState.currentY = e.clientY;
    this.swipeState.active = false;

    this._swipeEnd();
  },

  didInsertElement(...args) {
    this._super(...args);

    this.element.addEventListener('touchstart', Ember.run.bind(this, this._touchStart));
    this.element.addEventListener('touchmove', Ember.run.bind(this, this._touchMove));
    this.element.addEventListener('touchend', Ember.run.bind(this, this._touchEnd));

    const startEvent = Ember.run.bind(this, this._startEvent);
    const moveEvent = Ember.run.bind(this, this._moveEvent);
    const endEvent = Ember.run.bind(this, this._endEvent);
    const removeClickEvents = () => {
      this.element.removeEventListener('mousedown', startEvent);
      this.element.removeEventListener('mousemove', moveEvent);
      this.element.removeEventListener('mouseup', endEvent);
      this.element.removeEventListener('touchstart', removeClickEvents);
    };

    this.element.addEventListener('mousedown', startEvent);
    this.element.addEventListener('mousemove', moveEvent);
    this.element.addEventListener('mouseup', endEvent);
    this.element.addEventListener('touchstart', removeClickEvents);

    this.set('navState.currentImage', this.get('initialPost.images.firstObject'));
  },

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

  _swipeStart() {
    const navState = this.get('navState');

    navState.setProperties({
      isSettling: false,
      userHasInteracted: true
    });
  },

  _swipeMove() {
    const swipeState = this.get('swipeState');
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

  _swipeEnd() {
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
      case 'right': return this._getHorizontalNeighbor(xIndex + 1, yIndex);
      case 'left': return this._getHorizontalNeighbor(xIndex - 1, yIndex);
      case 'up': return this._getVerticalNeighbor(post, yIndex - 1, 'lastObject');
      case 'down': return this._getVerticalNeighbor(post, yIndex + 1, 'firstObject');
    }
  },

  _getHorizontalNeighbor(xIndex, yIndex) {
    const post = this.get('orderedPosts')[xIndex];

    return post ? post.get('images').toArray()[yIndex] || post.get('images.lastObject') : 'edge';
  },

  _getVerticalNeighbor(post, yIndex, wrapIndex) {
    return post.get('images').toArray()[yIndex] || post.get(`images.${wrapIndex}`);
  }
});
