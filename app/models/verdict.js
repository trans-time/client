import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  moderationReport: DS.belongsTo('moderation-report'),
  moderator: DS.belongsTo('user', { inverse: 'verdicts' }),

  insertedAt: DS.attr('date'),
  moderatorComment: DS.attr('string'),
  wasViolation: DS.attr('boolean'),

  actionBannedUser: DS.attr('boolean'),
  actionDeletedFlaggable: DS.attr('boolean'),
  actionIgnoreFlags: DS.attr('boolean'),
  actionLockComments: DS.attr('boolean'),
  banUserDuration: DS.attr('number'),
  lockCommentsDuration: DS.attr('number')
});
