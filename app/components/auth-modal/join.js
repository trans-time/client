import { or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateFormat,
  validateInclusion,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';

const SessionValidations = {
  email: [
    validateLength({ max: 1000 }),
    validatePresence(true),
    validateFormat({ type: 'email' })
  ],
  password: [
    validateLength({ max: 1000 }),
    validatePresence(true),
    validateLength({ min: 6 })
  ],
  coc: [
    (key, newValue) => newValue
  ],
  tos: [
    (key, newValue) => newValue
  ],
  username: [
    validateLength({ max: 64 }),
    validateFormat({ regex: /^[a-zA-Z0-9_]*$/ }),
    validatePresence(true)
  ]
};

export default Component.extend({
  classNames: ['main-modal-content'],

  modalManager: service(),
  session: service(),
  store: service(),

  disabled: or('changeset.isInvalid', 'changeset.isPristine'),

  init(...args) {
    this._super(...args);

    this.set('changeset', new Changeset(this.set('model', this.get('store').createRecord('user', { isTrans: true })), lookupValidator(SessionValidations), SessionValidations));
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
      this.get('changeset').save().catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      }).then(() => {
        const { username, password } = this.get('changeset').getProperties('username', 'password');

        this.get('session').authenticate('authenticator:basic', username, password).catch((reason) => {
          this.set('errorMessage', reason.error || reason);
        });
      });
    }
  }
});
