import { computed } from '@ember/object';
import DS from 'ember-data';
import Reactable from './reactable';

export default Reactable.extend({
  user: DS.belongsTo('user'),
  timelineItem: DS.belongsTo('timeline-item'),
  parent: DS.belongsTo('comment', { inverse: 'children' }),
  children: DS.hasMany('comment', { inverse: 'parent' }),
  flags: DS.hasMany('flag', { inverse: 'flaggable' }),

  date: DS.attr('date'),
  deleted: DS.attr('boolean'),
  text: DS.attr('string'),

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
