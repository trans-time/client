import { computed, observer } from '@ember/object';
import { alias, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import Component from '@ember/component';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateLength
} from 'ember-changeset-validations/validators';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';

const CommentValidations = {
  text: [
    validateLength({ max: 8000, min: 1 })
  ]
};

export default Component.extend(AuthenticatedActionMixin, {
  classNames: ['comment-form'],

  currentUser: service(),
  store: service(),

  commentsAreLocked: alias('commentable.commentsAreLocked'),
  user: alias('currentUser.user'),

  disabled: or('changeset.isInvalid', 'changeset.isPristine', 'isSaving', 'commentsAreLocked'),

  didReceiveAttrs(...args) {
    this._super(...args);

    this._resetChangeset();
  },

  isDeepReply: computed({
    get() {
      return isPresent(this.get('replyingTo.parent.content'));
    }
  }),

  _resetChangeset() {
    const comment = this.get('comment') || this.get('store').createRecord('comment', this.getProperties('commentable', 'parent'));
    const changeset = this.set('changeset', new Changeset(comment, lookupValidator(CommentValidations), CommentValidations));

    if (this.get('commentsAreLocked')) return;
    if (this.get('isDeepReply')) changeset.set('text', `@${this.get('replyingTo.user.username')} `);
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
      this.set('isSaving', true);

      this.authenticatedAction().then(() => {
        const changeset = this.get('changeset');

        changeset.setProperties({
          user: this.get('user'),
          date: new Date(Date.now())
        });

        changeset.save().then((comment) => {
          this.attrs.addComment(comment);
          if (this.get('commentable')) {
            this.incrementProperty('commentable.commentCount');
            this.set('commentable.commentDraft', undefined);
          }
          this._resetChangeset();
        }).finally(() => {
          this.set('isSaving', false);
        });
      }).catch(() => {
        this.set('isSaving', false);
      });
    }
  }
});
