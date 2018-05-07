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
  actionChangeMaturityRating: DS.attr('number'),
  actionDeleteMedia: DS.attr('boolean'),
  deleteMediaIndexes: DS.attr(),
  banUserUntil: DS.attr('date'),
  lockCommentsUntil: DS.attr('date'),

  cloneAttrs(verdict) {
    const cloneProperties = verdict ? verdict.toJSON() : {};
    delete cloneProperties.id;
    delete cloneProperties.moderationReport;
    delete cloneProperties.moderator;
    delete cloneProperties.insertedAt;
    delete cloneProperties.moderatorComment;

    this.setProperties(cloneProperties);

    return this;
  }
});
