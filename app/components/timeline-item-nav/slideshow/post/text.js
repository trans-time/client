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

    this._checkTextOverflow();

    const element = this.get('_constraint');
    window.addEventListener('resize', this._checkTextOverflow.bind(this));
    element.addEventListener('dblclick', this._expandOrCollapseText.bind(this));
    element.addEventListener('touchend', this._checkForDoubleTap.bind(this));
  },

  textHidden: computed('userRevealedText', 'textOverflown', {
    get() {
      return !this.get('userRevealedText') && this.get('textOverflown');
    }
  }),

  _expandOrCollapseText(event) {
    this.toggleProperty('userRevealedText');

    if (event) {
      event.preventDefault();
    }
  },

  _checkForDoubleTap(event) {
    if (this.hasRecentlyTapped) {
      this._expandOrCollapseText(event);
    } else {
      this._initiateDoubleTapTask.perform();
    }
  },

  _initiateDoubleTapTask: task(function * () {
    this.set('hasRecentlyTapped', true);

    yield timeout(500);

    this.set('hasRecentlyTapped', false);
  }).restartable(),

  _checkTextOverflow() {
    const element = this.get('_constraint');

    this.set('textOverflown', element.clientHeight < element.scrollHeight);
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
