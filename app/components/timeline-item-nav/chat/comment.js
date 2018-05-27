import { computed } from '@ember/object';
import { alias, filter, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { isEmpty, isPresent } from '@ember/utils';
import Component from '@ember/component';
import { Promise } from 'rsvp';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';

export default Component.extend(AuthenticatedActionMixin, {
  classNames: ['comment'],
  classNameBindings: ['isCollapsedChild'],

  childrenAreCollapsed: true,

  currentUser: service(),
  intl: service(),
  modalManager: service(),
  store: service(),

  children: alias('comment.children'),
  savedChildren: filter('children', (comment) => !comment.get('isNew')),

  pronouns: computed('comment.user.pronouns', {
    get() {
      return this.get('comment.user.pronouns').split('/').join(' / ');
    }
  }),

  orderedFilteredChildren: sort('filteredChildren', (a, b) => {
    return a.get('date') > b.get('date');
  }),

  showAsDeleted: computed('comment.deleted', {
    get() {
      return !this.get('isModerating') && !this.get('isRouteComment') && this.get('comment.deleted');
    }
  }),

  showHistoryToggle: computed({
    get() {
      return this.get('isModerating') && this.get('comment.textVersions.length') > 0;
    }
  }),

  isRouteComment: computed('routeComment', 'comment', {
    get() {
      return this.get('routeComment') === this.get('comment');
    }
  }),

  filteredChildren: computed('savedChildren.@each.shouldDisplay', {
    get() {
      const children = this.get('savedChildren');

      return this.get('isModerating') || this.get('routeComment') ? children : children.filter((comment) => {
        return comment.get('shouldDisplay');
      });
    }
  }),

  textIsOverflown: computed('comment.text', 'overflowIsExpanded', {
    get() {
      return !this.get('overflowIsExpanded') && this.get('comment.text.length') > 500;
    }
  }),

  replyParent: computed({
    get() {
      return this.get('comment.parent.content') || this.get('comment');
    }
  }),

  click(...args) {
    this._super(...args);

    this._wasClicked();
  },

  touchUp(...args) {
    this._super(...args);

    this._wasClicked();
  },

  _wasClicked() {
    if (this.attrs.wasClicked) this.attrs.wasClicked();
  },

  _disableDeleteUntilResolved(cb) {
    this.set('deleteDisabled', true);

    new Promise((resolve) => {
      cb(resolve);
    }).then(() => {
      this.set('deleteDisabled', false);
    });
  },

  actions: {
    delete(comment) {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('comments.deleteCommentConfirmation') });
      }).then(() => {
        this._disableDeleteUntilResolved((resolve) => {
          this.attrs.removeComment(comment);
        });
      });
    },

    hideHistory() {
      this.set('historyIsRevealed', false);
    },

    removeComment(comment) {
      this.attrs.removeComment(comment);
    },

    expandChildren() {
      this.set('childrenAreCollapsed', false);
    },

    expandOverflow() {
      this.set('overflowIsExpanded', true);
    },

    reply() {
      this.set('replying', true);
    },

    report() {
      this.authenticatedAction().then(() => {
        new Promise((resolve, reject) => {
          this.get('modalManager').open('flag-modal', resolve, reject, {
            flag: this.get('store').createRecord('flag', {
              user: this.get('currentUser.user'),
              flaggable: this.get('comment')
            })
          });
        });
      });
    },

    closeReply() {
      this.set('replying', false);
    },

    startEditing() {
      this.set('isEditing', true);
      next(() => this.$('textarea').focus());
    },

    stopEditing() {
      this.set('isEditing', false);
    },

    viewHistory() {
      this.set('historyIsRevealed', true);
    }
  }
});
