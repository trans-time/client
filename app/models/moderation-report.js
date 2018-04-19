import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  comment: DS.belongsTo('comment'),
  post: DS.belongsTo('post'),
  flags: DS.hasMany('flag'),
  indicted: DS.belongsTo('user', { inverse: 'indictions' }),
  moderator: DS.belongsTo('user', { inverse: 'moderationReports' }),

  insertedAt: DS.attr('date'),
  moderatorComment: DS.attr('string'),
  resolved: DS.attr('boolean'),
  wasViolation: DS.attr('boolean'),

  actionBannedUser: DS.attr('boolean'),
  actionDeletedFlaggable: DS.attr('boolean'),
  actionIgnoreFlags: DS.attr('boolean'),
  actionLockComments: DS.attr('boolean'),
  banUserDuration: DS.attr('number'),
  lockCommentsDuration: DS.attr('number'),

  flaggable: computed('comment', 'post', {
    get() {
      return this.get('comment') || this.get('post');
    },
    set(key, flaggable) {
      const type = flaggable.constructor.modelName || flaggable.content.constructor.modelName;

      this.set(type, flaggable);
    }
  }),
});
