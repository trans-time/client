import Component from '@ember/component';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  intl: service(),
  maturityManager: service(),
  modalManager: service(),

  currentMaturityRating: oneWay('maturityManager.currentMaturityRating'),

  newMaturityRating: computed('_maturityRating', {
    get() {
      return this.get('_maturityRating') || this.get('currentMaturityRating');
    },
    set(key, value) {
      return this.set('_maturityRating', value);
    }
  }),

  actions: {
    changeMaturityRatingForSession() {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('matureContent.confirmation') });
      }).then(() => {
        this.get('maturityManager').setMaturityRating(sessionStorage, this.get('newMaturityRating'));
      });
    },

    changeMaturityRatingForAlways() {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('matureContent.confirmation') });
      }).then(() => {
        this.get('maturityManager').setMaturityRating(localStorage, this.get('newMaturityRating'));
      });
    }
  }
});
