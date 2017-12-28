import { computed } from '@ember/object';
import { filter, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['comment'],
  classNameBindings: ['isCollapsedChild'],

  childrenAreCollapsed: true,

  currentUser: service(),
  modalManager: service(),
  intl: service(),

  savedChildren: filter('comment.children', (comment) => !comment.get('isNew')),

  orderedChildren: sort('savedChildren', (a, b) => {
    return a.get('date') > b.get('date');
  }),

  textIsOverflown: computed('comment.text', 'overflowIsExpanded', {
    get() {
      return !this.get('overflowIsExpanded') && this.get('comment.text.length') > 500;
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

    closeReply() {
      this.set('replying', false);
    },

    startEditing() {
      this.set('isEditing', true);
      next(() => this.$('textarea').focus());
    },

    stopEditing() {
      this.set('isEditing', false);
    }
  }
});
