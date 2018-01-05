import { or } from '@ember/object/computed';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateConfirmation,
  validatePresence,
  validateLength
} from 'ember-changeset-validations/validators';
import { Promise } from 'rsvp';

const PasswordValidations = {
  newPassword: [
    validatePresence(true),
    validateLength({ min: 6 })
  ],
  newPasswordConfirmation: [
    validatePresence(true),
    validateConfirmation({ on: 'newPassword' })
  ],
  previousPassword: [
    validatePresence(true),
    validateLength({ min: 6 })
  ]
};

export default Component.extend({
  disabled: or('changeset.isInvalid', 'changeset.isPristine', 'isSubmitting'),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('changeset', new Changeset(this.get('passwordChange'), lookupValidator(PasswordValidations), PasswordValidations));
    this.get('changeset').validate();
  },

  actions: {
    submit() {
      this.setProperties({
        isSubmitting: true,
        succeded: false,
        failed: false
      });

      const promise = new Promise((resolve, reject) => this.attrs.submit(this.get('changeset'), resolve, reject));

      promise.then(() => {
        this.set('succeded', true);
      }).catch((message) => {
        this.set('failed', message);
      }).finally(() => this.set('isSubmitting', false));
    }
  }
});
