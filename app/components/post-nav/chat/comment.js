import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
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

  orderedChildren: sort('comment.children', (a, b) => {
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

    startEditing() {
      this.set('isEditing', true);
      next(() => this.$('textarea').focus());
    },

    stopEditing() {
      this.set('isEditing', false);
    }
  }
});
