import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['comment'],
  classNameBindings: ['isCollapsedChild'],

  childrenAreCollapsed: true,

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
    }
  }
});
