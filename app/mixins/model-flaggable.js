import Mixin from '@ember/object/mixin';

export default Mixin.create({
  flags: DS.hasMany('flag'),
  textVersions: DS.hasMany('text-version'),
  moderationReports: DS.hasMany('moderation-report'),

  isMarkedForDeletionByModerator: DS.attr('boolean'),
  isIgnoringFlags: DS.attr('boolean'),
  isUnderModeration: DS.attr('boolean')
});
