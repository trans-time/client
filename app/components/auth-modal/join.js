import Ember from 'ember';
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

export default Ember.Component.extend({
  classNames: ['main-modal-content'],

  modalManager: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),

  disabled: Ember.computed.or('changeset.isInvalid', 'changeset.isPristine'),

  init(...args) {
    this._super(...args);

    this.set('changeset', new Changeset(this.set('model', this.get('store').createRecord('user')), lookupValidator(SessionValidations), SessionValidations));
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
