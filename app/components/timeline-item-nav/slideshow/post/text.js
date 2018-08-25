import { bind } from '@ember/runloop';
import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import { alias } from '@ember/object/computed';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { Promise } from 'rsvp';
import { task, timeout } from 'ember-concurrency';
import { EKMixin, EKOnInsertMixin, keyDown } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, {
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
    if (this.get('shouldFocus')) this.get('_constraint').focus();
  },

  didReceiveAttrs(...args) {
    this._super(...args);

    if (this.get('isCurrentPost') && !this.get('chatIsOpen')) next(() => this.$('.timeline-item-nav-post-text').focus());
    if (this.get('shouldFocus') && this.element) this.get('_constraint').focus();
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

  _keyRevealText: on(keyDown('ArrowDown'), function(e) {
    this._revealText()
  }),

  _keyExpandOrCollapse: on(keyDown('KeyV'), function(e) {
    this._expandOrCollapseText()
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
      this._determineNavability();
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
    const element = this.get('_constraint');

    swipeState.diffY = 0;
    swipeState.startY = e.clientY;
    swipeState.startX = e.clientX;
    swipeState.currentY = e.clientY;
    swipeState.active = true;
    swipeState.diffs.length = 0;

    this._determineNavability();
  },

  _determineNavability() {
    const swipeState = this.get('swipeState');
    const element = this.get('_constraint');

    swipeState.canNavDown = Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight;
    swipeState.canNavUp = element.scrollTop <= 0 && !this.get('panelHeightIsModified');
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

    if ((!this.get('chatIsOpen') && ((diff > 0 && !swipeState.canNavUp) || (diff < 0 && !swipeState.canNavDown))) || (this.get('chatIsOpen') && ((diff > 0 && Math.floor(element.scrollTop) > 0) || (diff < 0 && Math.ceil(this.element.scrollHeight + this.element.clientHeight) < this.element.clientHeight)))) {
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
        swipeState.canNavUp = false;
      } else if (element.scrollTop <= 0) {
        element.scrollTop = 0;
        swipeState.canNavDown = false;
      } else {
        swipeState.canNavUp = false;
        swipeState.canNavDown = false;
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
        this._expandOrCollapseText(event);
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

          if (Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight) {
            return element.scrollTop = element.scrollHeight - element.clientHeight;
          } else if (element.scrollTop < 0) {
            return element.scrollTop = 0;
          }
        }

        velocity *= 0.95;

        if (Math.abs(velocity) > 1 && !swipeState.active) requestAnimationFrame(loop);
      }

      loop();
    }
  },

  _expandOrCollapseText(event) {
    const element = this.get('_constraint');
    element.focus();

    if (this.get('panelHeightIsModified')) {
      this.expendTextOnSwipe(9999999);
    } else {
      this.expendTextOnSwipe(element.clientHeight < element.scrollHeight ? -element.scrollHeight : (this.element.parentElement.clientHeight / 3) * -2);
      this.set('userRevealedText', true);
    }

    if (event) {
      event.preventDefault();
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

  _revealText() {
    if (this.get('shouldFocus') && !this.get('userRevealedText')) {
      this.set('userRevealedText', true);
    }
  },

  actions: {
    revealText() {
      this._revealText();
      this.get('_constraint').focus();
    }
  }
});
