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

  _resetChangeset() {
    const comment = this.get('comment') || this.get('store').createRecord('comment', this.getProperties('post', 'parent'));
    const changeset = this.set('changeset', new Changeset(comment, lookupValidator(CommentValidations), CommentValidations));

    if (this.get('isDeepReply')) changeset.set('text', `@${this.get('commentable.user.username')} `);
    if (this.get('commentable.commentDraft')) changeset.set('text', this.get('commentable.commentDraft'));

    this.get('changeset').validate();
  },

  _setCommentableDraftComment: observer('changeset.text', function() {
    if (this.get('commentable')) this.set('commentable.commentDraft', this.get('changeset.text'));
  }),

  actions: {
    cancel() {
      this.attrs.cancel();
    },

    submit() {
      const changeset = this.get('changeset');

      changeset.setProperties({
        user: this.get('user'),
        date: Date.now()
      });

      changeset.save().then((comment) => {
        this.attrs.addComment(comment);
        if (this.get('commentable')) this.set('commentable.commentDraft', undefined);
        this._resetChangeset();
      });
    }
  }
});
