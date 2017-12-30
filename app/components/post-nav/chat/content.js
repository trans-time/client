import { A } from '@ember/array';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isNone } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['comments'],

  store: service(),

  orderedComments: sort('ownComments', (a, b) => {
    return a.get('date') > b.get('date');
  }),

  didReceiveAttrs(...args) {
    this._super(...args);

    const loadedComments = this.get('post.loadedComments');

    if (isNone(loadedComments)) {
      this.set('isLoaded', false);
    } else {
      this.setProperties({
        isLoaded: true,
        comments: loadedComments
      });
    }

    this.get('store').query('comment', { postId: this.get('post.id'), include: 'user, user.userProfile' }).then((comments) => {
      this.setProperties({
        comments: A(comments.toArray()),
        isLoaded: true
      });

      this.set('post.loadedComments', comments);
    });
  },

  ownComments: computed('comments.[]', {
    get() {
      return this.get('comments').filter((comment) => isNone(comment.get('parent.content')) && comment.get('shouldDisplay'));
    }
  }),

  actions: {
    addComment(comment) {
      this.get('comments').pushObject(comment);
    },

    removeComment(comment) {
      if (comment.get('nondeletedChildren.length') === 0) this.get('comments').removeObject(comment);
      comment.destroyRecord();
    }
  }
});
