import { bind } from '@ember/runloop';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { Promise } from 'rsvp';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: ['timeline-item-nav-post'],
  classNameBindings: ['textRevealed'],

  currentUser: service(),
  intl: service(),
  meta: service(),
  modalManager: service(),
  store: service(),
  user: alias('currentUser.user'),
  usingTouch: alias('meta.usingTouch'),
  swipeState: computed(() => {
    return {
      lockBuffer: 0,
      diffs: []
    }
  }),

  didInsertElement(...args) {
    this._super(...args);

    this.element.addEventListener('touchstart', bind(this, this._touchStart));
    this.element.addEventListener('touchmove', bind(this, this._touchMove), { passive: false });
    this.element.addEventListener('touchend', bind(this, this._touchEnd));
    this.element.addEventListener('wheel', bind(this, this._wheel));

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

    if (this.get('isCurrentPost') && !this.get('chatIsOpen')) next(() => this.$('.timeline-item-nav-post-text').focus());
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

  _wheel(e) {
    if (e.deltaY && !this.get('_scollLocked')) {
      this._fulfillMoveEvent(e, e.deltaY * -1);
    }
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
    swipeState.startX = e.clientX;
    swipeState.currentY = e.clientY;
    swipeState.active = true;
    swipeState.diffs.length = 0;
    swipeState.lockBuffer = 0;
  },

  _moveEvent(event) {
    const e = event.changedTouches ? event.changedTouches[0] : event;
    const swipeState = this.get('swipeState');
    if (!swipeState.active || this.get('_scollLocked')) return;

    swipeState.diffY = e.clientY - swipeState.currentY;
    swipeState.currentY = e.clientY;

    this._fulfillMoveEvent(event, swipeState.diffY);
  },

  _fulfillMoveEvent(event, diff) {
    const swipeState = this.get('swipeState');
    const element = this.get('_constraint');
    const buffer = element.clientHeight >= element.scrollHeight && !this.get('panelHeightIsModified') ? 50 : 200;

    if ((diff < 0 && Math.ceil(element.clientHeight + element.scrollTop) < element.scrollHeight) || (diff > 0 && (element.scrollTop > 0 || this.get('panelHeightIsModified')))) {
      swipeState.lockBuffer = 0;
    } else {
      swipeState.lockBuffer += diff;
    }

    if ((!this.get('chatIsOpen') && Math.abs(swipeState.lockBuffer) < buffer) || (this.get('chatIsOpen') && Math.abs(swipeState.lockBuffer) === 0)) {
      swipeState.diffs.push(diff);

      event.preventDefault();
      event.stopPropagation();
    }

    if (!this.get('chatIsOpen') && diff < 0 && element.clientHeight < element.scrollHeight && this.element.clientHeight < (this.element.parentElement.clientHeight / 3) * 2) {
      this.expendTextOnSwipe(diff);
    } else if (!this.get('chatIsOpen') && diff > 0 && element.scrollTop === 0) {
      this.expendTextOnSwipe(diff);
    } else {
      element.scrollTop -= diff;

      if (Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight) {
        element.scrollTop = element.scrollHeight - element.clientHeight;
      } else if (element.scrollTop <= 0) {
        element.scrollTop = 0;
      }
    }
  },

  _endEvent(event) {
    const e = event.changedTouches ? event.changedTouches[0] : event;
    const swipeState = this.get('swipeState');
    if (!swipeState.active) return;

    const element = this.get('_constraint');

    swipeState.active = false;

    const precision = 5;
    const latestDiffs = swipeState.diffs.slice(Math.max(0, swipeState.diffs.length - precision), swipeState.diffs.length);
    const isTap = Math.abs(swipeState.startY - e.clientY) < 5 && Math.abs(swipeState.startX - e.clientX) < 5;

    if (isTap) {
      if (this.get('hasRecentlyTapped')) {
        this.expendTextOnSwipe(element.clientHeight < element.scrollHeight ? -element.scrollHeight : (this.element.parentElement.clientHeight / 3) * -2);
        this.set('userRevealedText', true);
      } else this.get('_initiateDoubleTapTask').perform();
    } else if (latestDiffs.length > 0) {
      let velocity = latestDiffs.reduce((sum, diff) => sum + diff, 0) / Math.min(latestDiffs.length, precision);

      const loop = () => {
        if (!this.element || this.get('_scollLocked')) return;

        if (!this.get('chatIsOpen') && velocity < 0 && element.clientHeight < element.scrollHeight && this.element.clientHeight < (this.element.parentElement.clientHeight / 3) * 2) {
          this.expendTextOnSwipe(velocity);
        } else if (!this.get('chatIsOpen') && velocity > 0 && element.scrollTop === 0) {
          this.expendTextOnSwipe(velocity);
        } else {
          element.scrollTop -= velocity;

          if (Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight) return element.scrollTop = element.scrollHeight - element.clientHeight;
          else if (element.scrollTop < 0) return element.scrollTop = 0;
        }

        velocity *= 0.95;

        if (Math.abs(velocity) > 1 && !swipeState.active) requestAnimationFrame(loop);
      }

      loop();
    }
  },

  _initiateDoubleTapTask: task(function * () {
    this.set('hasRecentlyTapped', true);

    yield timeout(500);

    this.set('hasRecentlyTapped', false);
  }).restartable(),

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
      return this.$('.timeline-item-nav-post-constraint').get(0);
    }
  }),

  actions: {
    revealText() {
      this.set('userRevealedText', true);
    }
  }
});
