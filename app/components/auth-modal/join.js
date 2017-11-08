import { or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateFormat,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';

const SessionValidations = {
  email: [
    validatePresence(true),
    validateFormat({ type: 'email' })
  ],
  password: [
    validatePresence(true),
    validateLength({ min: 6 })
  ],
  username: [
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

    this.set('changeset', new Changeset(this.set('model', this.get('store').createRecord('user')), lookupValidator(SessionValidations), SessionValidations));
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
      this.get('model').save().catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      }).then(() => {
        const { username, password } = this.get('changeset').getProperties('username', 'password');

        this.get('session').authenticate('authenticator:basic', username, password).catch((reason) => {
          this.set('errorMessage', reason.error || reason);
        }).then(() => {
          this.get('modalManager').close('resolve');
        });
      });
    }
  }
});
