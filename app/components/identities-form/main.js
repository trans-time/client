import { A } from '@ember/array';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateFormat,
  validateLength
} from 'ember-changeset-validations/validators';

const UserIdentityValidations = {
  name: [
    validateFormat({ regex: /^[a-zA-Z0-9_-]*$/ }),
    validateLength({ max: 64 })
  ]
};

export default Component.extend({
  classNames: ['identities-form-main'],

  userIdentities: alias('user.userIdentities'),

  store: service(),

  didReceiveAttrs(...args) {
    this._super(...args);

    const changesets = A(this.get('userIdentities').map((userIdentity) => {
      return this._generateChangeset(userIdentity);
    }));

    this.set('changesets', changesets);
  },

  disabled: computed('changesets.@each.isInvalid', 'changesets.@each.isPristine', {
    get() {
      const changesets = this.get('changesets');

      return changesets.any((changeset) => changeset.get('isInvalid')) || changesets.every((changeset) => changeset.get('isPristine'));
    }
  }),

  _generateChangeset(userIdentity) {
    const changeset = new Changeset(userIdentity, lookupValidator(UserIdentityValidations), UserIdentityValidations);

    changeset.validate();

    return changeset;
  },

  actions: {
    newUserIdentity() {
      this.get('changesets').pushObject(this._generateChangeset(this.get('store').createRecord('user-identity', { user: this.get('user') })));
    },

    removeUserIdentity(userIdentity) {
      this.get('changesets').removeObject(userIdentity);
    }
  }
});
