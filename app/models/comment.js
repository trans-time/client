import { computed } from '@ember/object';
import { camelize } from '@ember/string';
import DS from 'ember-data';
import Flaggable from 'client/mixins/model-flaggable';
import Reactable from 'client/mixins/model-reactable';

export default DS.Model.extend(Flaggable, Reactable, {
  user: DS.belongsTo('user'),
  timelineItem: DS.belongsTo('timeline-item'),
  parent: DS.belongsTo('comment', { inverse: 'children' }),
  children: DS.hasMany('comment', { inverse: 'parent' }),

  commentCount: DS.attr('number'),
  insertedAt: DS.attr('date'),
  deleted: DS.attr('boolean'),
  text: DS.attr('string'),

  commentable: computed('timelineItem', {
    get() {
      return this.get('timelineItem');
    },
    set(key, commentable) {
      const type = commentable.constructor.modelName || commentable.content.constructor.modelName;

      this.set(camelize(type), commentable);
    }
  }),

  shouldDisplay: computed('deleted', {
    get() {
      return !this.get('deleted');
    }
  })
});
