import { or } from '@ember/object/computed';
import Component from '@ember/component';
import { Promise } from 'rsvp';

export default Component.extend({
  disabled: or('changeset.isInvalid', 'changeset.isPristine', 'isSubmitting'),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.get('changeset').validate();
  },

  actions: {
    submit() {
      this.setProperties({
        isSubmitting: true
      });

      const promise = new Promise((resolve, reject) => this.attrs.submit(this.get('changeset'), resolve, reject));

      promise.finally(() => this.set('isSubmitting', false));
    }
  }
});
