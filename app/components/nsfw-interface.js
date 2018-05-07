import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  intl: service(),
  modalManager: service(),

  currentMaturityRating: computed({
    get() {
      return JSON.parse(sessionStorage.getItem('maturityRating')) || JSON.parse(localStorage.getItem('maturityRating')) || 0;
    }
  }),

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
        sessionStorage.setItem('maturityRating', this.get('newMaturityRating'));
        this.notifyPropertyChange('currentMaturityRating');
      });
    },

    changeMaturityRatingForAlways() {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('matureContent.confirmation') });
      }).then(() => {
        localStorage.setItem('maturityRating', this.get('newMaturityRating'));
        this.notifyPropertyChange('currentMaturityRating');
      });
    }
  }
});
