import { computed, observer } from '@ember/object';
import { alias, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateLength
} from 'ember-changeset-validations/validators';

const CommentValidations = {
  text: [
    validateLength({ max: 63206, min: 1 })
  ]
};

export default Component.extend({
  classNames: ['comment-form'],

  currentUser: service(),
  store: service(),

  user: alias('currentUser.user'),

  disabled: or('changeset.isInvalid', 'changeset.isPristine'),

  didReceiveAttrs(...args) {
    this._super(...args);

    this._resetChangeset();
  },

  commentable: computed({
    get() {
      return this.get('parent') || this.get('post');
    }
  }),

  _resetChangeset() {
    const comment = this.get('store').createRecord('comment', this.getProperties('post', 'parent'));

    comment.set('text', this.get('commentable.commentDraft'));

    this.set('changeset', new Changeset(comment, lookupValidator(CommentValidations), CommentValidations));
    this.get('changeset').validate();
  },

  _setCommentableDraftComment: observer('changeset.text', function() {
    this.set('commentable.commentDraft', this.get('changeset.text'));
  }),

  actions: {
    submit() {
      const changeset = this.get('changeset');

      changeset.setProperties({
        user: this.get('user'),
        date: Date.now()
      });

      changeset.save().then((comment) => {
        this.attrs.addComment(comment);
        this.set('commentable.commentDraft', undefined);
        this._resetChangeset();
      });
    }
  }
});
