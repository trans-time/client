import { or } from '@ember/object/computed';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validatePresence,
  validateLength
} from 'ember-changeset-validations/validators';

const PostValidations = {
  text: [
    validateLength({ max: 63206 })
  ]
};

export default Component.extend({
  view: 'text',

  disabled: or('changeset.isInvalid', 'changeset.isPristine'),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('changeset', new Changeset(this.get('post'), lookupValidator(PostValidations), PostValidations));
    this.get('changeset').validate();
  },

  actions: {
    transition(view) {
      this.set('view', view);
    }
  }
});
