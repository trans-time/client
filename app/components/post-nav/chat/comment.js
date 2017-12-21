import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['comment'],
  classNameBindings: ['isCollapsedChild'],

  childrenAreCollapsed: true,

  moment: service(),

  orderedChildren: sort('comment.children', (a, b) => {
    return a.get('date').getTime() > b.get('date').getTime();
  }),

  textIsOverflown: computed('comment.text', 'overflowIsExpanded', {
    get() {
      return !this.get('overflowIsExpanded') && this.get('comment.text.length') > 500;
    }
  }),

  showRelativeDate: computed('comment.date', {
    get() {
      const moment = this.get('moment');
      const now = moment.moment(Date.now());
      const date = moment.moment(this.get('comment.date'));

      return date.isAfter(now.subtract(1, 'month'));
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
