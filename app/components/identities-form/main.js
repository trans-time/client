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
import validateDateSequence from 'client/validators/date-sequence';

const UserIdentityValidations = {
  name: [
    validateFormat({ regex: /^[a-zA-Z0-9_]*$/ }),
    validateLength({ max: 64 })
  ],
  startDate: [
    validateDateSequence({ before: 'endDate' })
  ]
};

export default Component.extend({
  classNames: ['identities-form-main'],

  userIdentities: alias('user.userIdentities'),

  store: service(),

  didInsertElement(...args) {
    this._super(...args);

    this.set('changesets', this.changesets.filter((changeset) => changeset.get('name.length') > 0));

    this._addNewIdentity();
  },

  didReceiveAttrs(...args) {
    this._super(...args);

    const changesets = A(this.get('userIdentities').map((userIdentity) => {
      return this._generateChangeset(userIdentity);
    }));

    this.set('changesets', changesets);
  },

  disabled: computed('changesets.@each.isInvalid', 'changesets.@each.isPristine', 'submitting', {
    get() {
      const changesets = this.get('changesets');

      return this.get('submitting') || changesets.any((changeset) => changeset.get('isInvalid')) || changesets.every((changeset) => changeset.get('isPristine'));
    }
  }),

  _generateChangeset(userIdentity) {
    const changeset = new Changeset(userIdentity, lookupValidator(UserIdentityValidations), UserIdentityValidations);

    changeset.validate();

    return changeset;
  },

  _addNewIdentity() {
    this.get('changesets').pushObject(this._generateChangeset(this.get('store').createRecord('user-identity', { user: this.get('user') })));
  },

  actions: {
    cancel() {
      this.attrs.cancel();
    },

    newUserIdentity() {
      this._addNewIdentity();
    },

    removeUserIdentity(userIdentity) {
      userIdentity.get('_content').destroyRecord().then(() => {
        this.get('changesets').removeObject(userIdentity);
      });
    },

    submit() {
      this.set('submitting', true);

      new Promise((resolve) => {
        this.attrs.submit(this.get('changesets'), resolve);
      }).then(() => {
        if (!this.get('isDestroyed')) this.set('submitting', false);
      });
    }
  }
});
