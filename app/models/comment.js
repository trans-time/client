import { computed } from '@ember/object';
import DS from 'ember-data';
import Reactable from './reactable';

export default Reactable.extend({
  user: DS.belongsTo('user'),
  post: DS.belongsTo('post'),
  parent: DS.belongsTo('comment', { inverse: 'children' }),
  children: DS.hasMany('comment', { inverse: 'parent' }),
  flags: DS.hasMany('flag', { inverse: 'flaggable' }),

  insertedAt: DS.attr('date'),
  deleted: DS.attr('boolean'),
  text: DS.attr('string'),

  commentable: computed('post', {
    get() {
      return this.get('post');
    }
  }),

  nondeletedChildren: computed('children.@each.shouldDisplay', {
    get() {
      return this.get('children').filterBy('shouldDisplay', true);
    }
  }),

  shouldDisplay: computed('deleted', 'nondeletedChildren.length', {
    get() {
      return !(this.get('deleted') || this.get('underModeration')) || this.get('nondeletedChildren.length') > 0;
    }
  })
});
