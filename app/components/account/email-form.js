import { or } from '@ember/object/computed';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateFormat,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';
import { Promise } from 'rsvp';

const EmailValidations = {
  email: [
    validatePresence(true),
    validateFormat({ type: 'email' })
  ],
  password: [
    validatePresence(true),
    validateLength({ min: 6 })
  ]
};

export default Component.extend({
  disabled: or('changeset.isInvalid', 'changeset.isPristine', 'isSubmitting'),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('changeset', new Changeset(this.get('emailChange'), lookupValidator(EmailValidations), EmailValidations));
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
