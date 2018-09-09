import { or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validatePresence
} from 'ember-changeset-validations/validators';

const PasswordResetRequestValidations = {
  username: [
    validatePresence(true)
  ]
};

export default Component.extend({
  classNames: ['main-modal-content'],

  modalManager: service(),
  paperToaster: service(),
  session: service(),
  store: service(),

  disabled: or('changeset.isInvalid', 'changeset.isPristine'),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('changeset', new Changeset(this.get('store').createRecord('email-password-reset-request'), lookupValidator(PasswordResetRequestValidations), PasswordResetRequestValidations));
    this.get('changeset').validate();
  },

  actions: {
    cancel() {
      this.get('modalManager').close('reject');
    },

    login() {
      this.get('modalManager').open('auth-modal/login');
    },

    submit() {
      this.get('changeset').save().then(() => {
        this.get('paperToaster').show(this.get('intl').t('auth.passwordResetRequestCompleted'), {
          duration: 2000
        });
      }).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    }
  }
});
