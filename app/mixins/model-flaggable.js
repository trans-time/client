import Mixin from '@ember/object/mixin';

export default Mixin.create({
  flags: DS.hasMany('flag'),
  textVersions: DS.hasMany('text-version'),
  moderationReports: DS.hasMany('moderation-report'),

  deletedByModerator: DS.attr('boolean'),
  ignoreFlags: DS.attr('boolean'),
  underModeration: DS.attr('boolean')
});
