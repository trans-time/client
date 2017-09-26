import Ember from 'ember';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validatePresence,
  validateLength
} from 'ember-changeset-validations/validators';

const SessionValidations = {
  username: [
    validatePresence(true),
    validateLength({ min: 4 })
  ],
  password: [
    validatePresence(true),
    validateLength({ min: 4 })
  ]
};

export default Ember.Component.extend({
  classNames: ['main-modal-content'],

  modalManager: Ember.inject.service(),
  session: Ember.inject.service(),

  disabled: Ember.computed.or('changeset.isInvalid', 'changeset.isPristine'),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('changeset', new Changeset({}, lookupValidator(SessionValidations), SessionValidations));
  },

  actions: {
    cancel() {
      this.get('modalManager').close();
    },

    submit() {
      const { identification, password } = this.getProperties('identification', 'password');

      this.get('session').authenticate('authenticator:basic', identification, password).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      }).then(() => {
        this.get('modalManager').close();
      });
    }
  }
});
