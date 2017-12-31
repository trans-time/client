import { computed } from '@ember/object';
import DS from 'ember-data';
import Favable from './favable';

export default Favable.extend({
  user: DS.belongsTo('user'),
  post: DS.belongsTo('post'),
  parent: DS.belongsTo('comment', { inverse: 'children' }),
  children: DS.hasMany('comment', { inverse: 'parent' }),

  date: DS.attr('number'),
  deleted: DS.attr('boolean'),
  text: DS.attr('string'),

  nondeletedChildren: computed('children.@each.deleted', {
    get() {
      return this.get('children').filterBy('deleted', false);
    }
  }),

  shouldDisplay: computed('deleted', 'nondeletedChildren.length', {
    get() {
      return !this.get('deleted') || this.get('nondeletedChildren.length') > 0;
    }
  })
});
