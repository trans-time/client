import { or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateFormat,
  validatePresence,
  validateLength
} from 'ember-changeset-validations/validators';

const SessionValidations = {
  password: [
    validatePresence(true),
    validateLength({ min: 6 })
  ],
  username: [
    validateFormat({ regex: /^[a-zA-Z0-9_-]*$/ }),
    validatePresence(true)
  ]
};

export default Component.extend({
  classNames: ['main-modal-content'],

  modalManager: service(),
  session: service(),

  disabled: or('changeset.isInvalid', 'changeset.isPristine'),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('changeset', new Changeset({}, lookupValidator(SessionValidations), SessionValidations));
    this.get('changeset').validate();
  },

  actions: {
    cancel() {
      this.get('modalManager').close('reject');
    },

    join() {
      this.get('modalManager').open('auth-modal/join');
    },

    submit() {
      const { username, password } = this.get('changeset').getProperties('username', 'password');

      this.get('session').authenticate('authenticator:basic', username, password).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    }
  }
});
