import Ember from 'ember';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validatePresence,
  validateLength
} from 'ember-changeset-validations/validators';

const UserValidations = {
  username: [
    validatePresence(true),
    validateLength({ min: 4 })
  ]
};

export default Ember.Component.extend({
  router: Ember.inject.service('-routing'),
  disabled: Ember.computed.or('changeset.isInvalid', 'changeset.isPristine'),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('changeset', new Changeset(this.get('user'), lookupValidator(UserValidations), UserValidations));
  },

  actions: {
    cancel() {
      this.get('complete')();
    },

    submit() {
      this.get('changeset').save();
      this.get('complete')();
    }
  }
});
