import { bind } from '@ember/runloop';
import { computed, observer } from '@ember/object';
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

    window.addEventListener('resize', this.set('onResize',this._checkTextOverflow.bind(this)));
    this._checkTextOverflow();
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

  _determineNavability() {
    const swipeState = this.get('swipeState');
    const element = this.get('_constraint');

    swipeState.canNavDown = Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight;
    swipeState.canNavUp = element.scrollTop <= 0 && !this.get('panelHeightIsModified');
  },

  _expandOrCollapseText(event) {
    const element = this.get('_constraint');

    if (this.get('panelHeightIsModified')) {
      this.expendTextOnSwipe(9999999);
    } else {
      this.expendTextOnSwipe(element.clientHeight < element.scrollHeight ? -element.scrollHeight : (this.element.parentElement.parentElement.clientHeight / 3) * -2);
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

    this.set('textOverflown', element.clientHeight > 200);
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
    this.set('userRevealedText', true);
  },

  actions: {
    revealText() {
      this._revealText();
    }
  }
});
