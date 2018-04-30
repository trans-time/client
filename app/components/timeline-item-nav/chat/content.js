import { A } from '@ember/array';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { underscore } from '@ember/string';
import { isEmpty, isNone, isPresent } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['comments'],

  currentUser: service(),
  messageBus: service(),
  store: service(),

  init(...args) {
    this._super(...args);

    this.get('messageBus').subscribe('userWasAuthenticated', this, this._loadComments);
  },

  didReceiveAttrs(...args) {
    this._super(...args);

    const loadedComments = this.get('timelineItem.loadedComments');

    if (isNone(loadedComments)) {
      this.set('isLoaded', false);
    } else {
      this.setProperties({
        isLoaded: true,
        comments: loadedComments
      });
    }

    this._loadComments();
  },

  _loadComments() {
    const isModerating = this.get('isModerating');
    const commentable = this.get('timelineItem');

    let include = 'user,parent,children,reactions';
    if (isModerating) include += ',text_versions';

    const filter = {};
    filter[`${underscore(commentable.constructor.modelName)}_id`] = commentable.id;

    if (!isModerating) {
      filter.deleted = false;
      filter.under_moderation = false;
    }

    this.get('store').query('comment', { sort: 'inserted_at', filter, include }).then((comments) => {
      this.setProperties({
        comments: A(comments.toArray()),
        isLoaded: true
      });

      this.set('timelineItem.loadedComments', comments);
    });
  },

  orderedComments: sort('filteredComments', (a, b) => {
    return a.get('date') > b.get('date');
  }),

  orderedFilteredComments: computed('orderedComments.[]', 'currentUser.user.blockers', {
    get() {
      const blockers = this.get('currentUser.user.blockers.content');

      return isEmpty(blockers) || this.get('timelineItem.user') === this.get('currentUser.user') ? this.get('orderedComments') : this.get('orderedComments').filter((comment) => {
        return !blockers.includes(comment.get('user'));
      });
    }
  }),

  filteredComments: computed('comments.@each.shouldDisplay', {
    get() {
      const { isModerating, routeComment } = this.getProperties('isModerating', 'routeComment');
      return this.get('comments').filter((comment) => {
        return isNone(comment.get('parent.content')) && (isModerating || comment.get('shouldDisplay') || comment === routeComment || comment.get('children').includes(routeComment));
      });
    }
  }),

  actions: {
    addComment(comment) {
      this.get('comments').pushObject(comment);
    },

    removeComment(comment) {
      const commentParent = comment.get('parent.content');
      const commentChildrenCount = comment.get('commentCount') + 1;
      comment.set('deleted', true);
      comment.deleteRecord();

      comment.save().then(() => {
        if (isPresent(commentParent)) commentParent.decrementProperty('commentCount');
        this.decrementProperty('timelineItem.commentCount', commentChildrenCount);
      }).catch(() => {
        comment.rollback();
      });
    }
  }
});
