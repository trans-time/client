import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['comment'],
  classNameBindings: ['isCollapsedChild'],

  childrenAreCollapsed: true,

  currentUser: service(),

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

  actions: {
    expandChildren() {
      this.set('childrenAreCollapsed', false);
    },

    expandOverflow() {
      this.set('overflowIsExpanded', true);
    },

    startEditing() {
      this.set('isEditing', true);
    },

    stopEditing() {
      this.set('isEditing', false);
    }
  }
});
