import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  comment: DS.belongsTo('comment'),
  timelineItem: DS.belongsTo('timeline-item'),
  flags: DS.hasMany('flag'),
  indicted: DS.belongsTo('user', { inverse: 'indictions' }),
  verdicts: DS.hasMany('verdict'),

  insertedAt: DS.attr('date'),
  resolved: DS.attr('boolean'),
  wasViolation: DS.attr('boolean'),

  flaggable: computed('comment.content', 'timelineItem.content', {
    get() {
      return this.get('comment.content') || this.get('timelineItem.content');
    },
    set(key, flaggable) {
      const type = flaggable.constructor.modelName || flaggable.content.constructor.modelName;

      this.set(type, flaggable);
    }
  }),
});
