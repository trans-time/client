import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateLength
} from 'ember-changeset-validations/validators';

const PostValidations = {
  text: [
    validateLength({ max: 63206 })
  ]
};

export default Component.extend({
  view: 'text',

  classNames: ['post-form'],

  disabled: computed('changeset.isInvalid', 'changeset.isPristine', '_panelsAddedOrRemoved', {
    get() {
      if (this.get('changeset.isInvalid')) return true;
      else return !this.get('_panelsAddedOrRemoved') && this.get('changeset.isPristine');
    }
  }),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('changeset', new Changeset(this.get('post'), lookupValidator(PostValidations), PostValidations));
    this.get('changeset').validate();
    this.set('_initialPanels', this.get('post.panels').toArray());
  },

  _panelsAddedOrRemoved: computed('post.images.[]', function() {
    const initial = this.get('_initialPanels');
    const current = this.get('post.panels').toArray();

    return initial.length !== current.length || !initial.every((panel) => current.includes(panel));
  }),

  viewPath: computed('view', {
    get() {
      return `post-form/${this.get('view')}`;
    }
  }),

  actions: {
    transition(view) {
      this.set('view', view);
    }
  }
});
