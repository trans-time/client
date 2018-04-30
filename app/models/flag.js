import DS from 'ember-data';
import { computed } from '@ember/object';
import { camelize } from '@ember/string';

export default DS.Model.extend({
  comment: DS.belongsTo('comment'),
  timelineItem: DS.belongsTo('timeline-item'),
  user: DS.belongsTo('user'),
  moderationReport: DS.belongsTo('moderation-report'),

  insertedAt: DS.attr('date'),
  text: DS.attr('string'),
  bot: DS.attr('boolean'),
  illicitActivity: DS.attr('boolean'),
  trolling: DS.attr('boolean'),
  unconsentingImage: DS.attr('boolean'),
  unmarkedNSFW: DS.attr('boolean'),

  flaggable: computed('comment', 'timelineItem', {
    get() {
      return this.get('comment') || this.get('timelineItem');
    },
    set(key, flaggable) {
      const type = flaggable.constructor.modelName || flaggable.content.constructor.modelName;

      this.set(camelize(type), flaggable);
    }
  })
});
