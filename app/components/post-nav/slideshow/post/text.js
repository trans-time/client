import { bind } from '@ember/runloop';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { Promise } from 'rsvp';

export default Component.extend({
  classNames: ['post-nav-post'],
  classNameBindings: ['textExpanded:expanded', 'textRevealed'],

  currentUser: service(),
  intl: service(),
  meta: service(),
  modalManager: service(),
  user: alias('currentUser.user'),
  usingTouch: alias('meta.usingTouch'),
  swipeState: computed(() => {
    return {
      diffs: []
    }
  }),

  didInsertElement(...args) {
    this._super(...args);

    this.element.addEventListener('touchstart', bind(this, this._touchStart));
    this.element.addEventListener('touchmove', bind(this, this._touchMove));
    this.element.addEventListener('touchend', bind(this, this._touchEnd));

    if (!this.get('usingTouch')) {
      const startEvent = bind(this, this._startEvent);
      const moveEvent = bind(this, this._moveEvent);
      const endEvent = bind(this, this._endEvent);
      const mouseOutEvent = bind(this, this._mouseOut);
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

  didReceiveAttrs(...args) {
    this._super(...args);

    if (this.get('isCurrentPost')) next(() => this.$('.post-nav-post-text').focus());
  },

  willDestroyElement(...args) {
    window.removeEventListener('resize', this.get('onResize'));

    this._super(...args);
  },

  textRevealed: computed('userRevealedText', 'textOverflown', {
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
    if (!swipeState.active || this.get('_scollLocked')) return;

    const element = this.get('_constraint');

    swipeState.diffY = e.clientY - swipeState.currentY;
    swipeState.currentY = e.clientY;

    element.scrollTop -= swipeState.diffY;

    if (Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight) {
      element.scrollTop = element.scrollHeight - element.clientHeight;
      swipeState.active = false;
    } else if (element.scrollTop <= 0) {
      element.scrollTop = 0;
      swipeState.active = false;
    } else {
      swipeState.diffs.push(swipeState.diffY);

      event.preventDefault();
      event.stopPropagation();
    }
  },

  _endEvent() {
    const swipeState = this.get('swipeState');
    if (!swipeState.active) return;

    const element = this.get('_constraint');

    swipeState.active = false;

    const precision = 5;
    const latestDiffs = swipeState.diffs.slice(Math.max(0, swipeState.diffs.length - precision), swipeState.diffs.length);

    if (latestDiffs.length > 0) {
      let velocity = latestDiffs.reduce((sum, diff) => sum + diff, 0) / Math.min(latestDiffs.length, precision);

      const loop = () => {
        if (!this.element || this.get('_scollLocked')) return;

        element.scrollTop -= velocity;

        if (Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight) return element.scrollTop = element.scrollHeight - element.clientHeight;
        else if (element.scrollTop < 0) return element.scrollTop = 0;

        velocity *= 0.95;

        if (Math.abs(velocity) > 1 && !swipeState.active) requestAnimationFrame(loop);
      }

      loop();
    }
  },

  _checkTextOverflow() {
    const element = this.get('_constraint');

    this.set('textOverflown', element.scrollHeight > element.clientHeight);
  },

  _scollLocked: computed('scrollLocked', 'isBlank', {
    get() {
      return this.get('scrollLocked') || (this.get('isBlank') && !this.get('textRevealed'));
    }
  }),

  _constraint: computed({
    get() {
      return this.$('.post-nav-post-constraint').get(0);
    }
  }),

  actions: {
    delete(comment) {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('post.deleteConfirmation') });
      }).then(() => {
        this.set('controlsDisabled', true);

        new Promise((resolve) => {
          this.attrs.deletePost(this.get('post'), resolve);
        }).then(() => {
          this.attrs.removePost();
        }).finally(() => this.set('controlsDisabled', false));
      });
    },

    revealText() {
      this.set('userRevealedText', true);
    }
  }
});
