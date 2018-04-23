import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  comment: DS.belongsTo('comment'),
  post: DS.belongsTo('post'),
  user: DS.belongsTo('user'),
  moderationReport: DS.belongsTo('moderation-report'),

  insertedAt: DS.attr('date'),
  text: DS.attr('string'),
  bot: DS.attr('boolean'),
  illicitActivity: DS.attr('boolean'),
  trolling: DS.attr('boolean'),
  unconsentingImage: DS.attr('boolean'),
  unmarkedNSFW: DS.attr('boolean'),

  flaggable: computed('comment', 'post', {
    get() {
      return this.get('comment') || this.get('post');
    },
    set(key, flaggable) {
      const type = flaggable.constructor.modelName || flaggable.content.constructor.modelName;

      this.set(type, flaggable);
    }
  })
});
