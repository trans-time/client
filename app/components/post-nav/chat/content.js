import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isNone } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['comments'],

  store: service(),

  comments: computed(() => []),

  orderedComments: sort('ownComments', (a, b) => {
    return a.get('date').getTime() > b.get('date').getTime();
  }),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('isLoaded', false);

    this.get('store').query('comment', { postId: this.get('post.id'), include: 'user, user.userProfile' }).then((comments) => {
      this.setProperties({
        comments,
        isLoaded: true
      });
    });
  },

  ownComments: computed('comments', {
    get() {
      return this.get('comments').filter((comment) => isNone(comment.get('parent.content')));
    }
  })
});
