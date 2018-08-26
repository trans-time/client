import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  moderationReport: DS.belongsTo('moderation-report'),
  moderator: DS.belongsTo('user', { inverse: 'verdicts' }),

  insertedAt: DS.attr('date'),
  moderatorComment: DS.attr('string'),
  wasViolation: DS.attr('boolean'),

  actionBannedUser: DS.attr('boolean'),
  actionMarkFlaggableForDeletion: DS.attr('boolean'),
  actionIgnoreFlags: DS.attr('boolean'),
  actionLockComments: DS.attr('boolean'),
  actionChangeContentWarnings: DS.attr('string'),
  actionMarkImagesForDeletion: DS.attr('boolean'),
  deleteImageIds: DS.attr(),
  previousContentWarnings: DS.attr('string'),
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
