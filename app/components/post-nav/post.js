import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['post-nav-post'],
  classNameBindings: ['textExpanded:expanded', 'textRevealed'],

  meta: Ember.inject.service(),
  usingTouch: Ember.computed.alias('meta.usingTouch'),
  swipeState: Ember.computed(() => {
    return {
      diffs: []
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
      const mouseOutEvent = Ember.run.bind(this, this._mouseOut);
      const removeClickEvents = () => {
        this.set('usingTouch', true);
        this.element.removeEventListener('mousedown', startEvent);
        this.element.removeEventListener('mousemove', moveEvent);
        this.element.removeEventListener('mouseup', endEvent);
        this.element.removeEventListener('mouseout', mouseOutEvent);
        this.element.removeEventListener('touchstart', removeClickEvents);
      };

      this.element.addEventListener('mousedown', startEvent);
      this.element.addEventListener('mousemove', moveEvent);
      this.element.addEventListener('mouseout', mouseOutEvent);
      this.element.addEventListener('mouseup', endEvent);
      this.element.addEventListener('touchstart', removeClickEvents);
    }

    window.addEventListener('resize', this.set('onResize',this._checkTextOverflow.bind(this)));
    this._checkTextOverflow();
  },

  willDestroyElement(...args) {
    window.removeEventListener('resize', this.get('onResize'));
  },

  resizeType: Ember.computed('textExpanded', {
    get() {
      return this.get('textExpanded') ? 'compress' : 'expand'
    }
  }),

  textRevealed: Ember.computed('userRevealedText', 'textOverflown', {
    get() {
      return this.get('userRevealedText') || !this.get('textOverflown');
    }
  }),

  _touchStart(e) {
    this._startEvent(e);
  },

  _touchMove(e) {
    this._moveEvent(e);
  },

  _touchEnd(e) {
    this._endEvent(e);
  },

  _mouseOut(event) {
    const toElement = event.toElement || event.relatedTarget;
    if (toElement.parentNode === this.element.parentNode) {
      this._endEvent(event);
    }
  },

  _startEvent(event) {
    const e = event.changedTouches ? event.changedTouches[0] : event;
    const swipeState = this.get('swipeState');

    swipeState.diffY = 0;
    swipeState.startY = e.clientY;
    swipeState.currentY = e.clientY;
    swipeState.active = true;
    swipeState.diffs.length = 0;
  },

  _moveEvent(event) {
    const e = event.changedTouches ? event.changedTouches[0] : event;
    const swipeState = this.get('swipeState');
    if (!swipeState.active || this.get('scrollLocked')) return;

    swipeState.diffY = e.clientY - swipeState.currentY;
    swipeState.currentY = e.clientY;

    this.element.scrollTop -= swipeState.diffY;

    if (Math.ceil(this.element.scrollTop + this.element.clientHeight) >= this.element.scrollHeight) {
      this.element.scrollTop = this.element.scrollHeight - this.element.clientHeight;
      swipeState.active = false;
    } else if (this.element.scrollTop <= 0) {
      this.element.scrollTop = 0;
      swipeState.active = false;
    } else {
      swipeState.diffs.push(swipeState.diffY);

      event.preventDefault();
      event.stopPropagation();
    }
  },

  _endEvent(event) {
    const e = event.changedTouches ? event.changedTouches[0] : event;
    const swipeState = this.get('swipeState');
    if (!swipeState.active) return;

    swipeState.active = false;

    const precision = 5;
    const latestDiffs = swipeState.diffs.slice(Math.max(0, swipeState.diffs.length - precision), swipeState.diffs.length);

    if (latestDiffs.length > 0) {
      let velocity = latestDiffs.reduce((sum, diff) => sum + diff, 0) / Math.min(latestDiffs.length, precision);

      const loop = () => {
        if (!this.element || this.get('scrollLocked')) return;

        this.element.scrollTop -= velocity;

        if (Math.ceil(this.element.scrollTop + this.element.clientHeight) >= this.element.scrollHeight) return this.element.scrollTop = this.element.scrollHeight - this.element.clientHeight;
        else if (this.element.scrollTop < 0) return this.element.scrollTop = 0;

        velocity *= 0.95;

        if (Math.abs(velocity) > 1 && !swipeState.active) requestAnimationFrame(loop);
      }

      loop();
    }
  },

  _checkTextOverflow() {
    const element = this.$('.post-nav-post-constraint').get(0);

    this.set('textOverflown', element.scrollHeight > element.clientHeight);
  },

  actions: {
    expand() {
      this.attrs.expandText();
    },

    compress() {
      this.attrs.compressText();
    },

    revealText() {
      this.set('userRevealedText', true);
    }
  }
});
