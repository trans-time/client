import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['post-form-text'],

  maturityRatingOpen: computed('changeset.maturityRating', {
    get() {
      return this.get('changeset.maturityRating') > 0;
    },
    set(key, value) {
      if (value === true) this.set('changeset.maturityRating', 1);
      else this.set('changeset.maturityRating', 0);

      return value
    }
  }),

  actions: {
    textareaFocus() {
      console.log('focus')
    }
  }
});
