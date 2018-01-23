import DS from 'ember-data';

export default DS.Model.extend({
  flags: DS.hasMany('flag', { inverse: 'flaggable' }),
  textVersions: DS.hasMany('text-version'),
  moderationReports: DS.hasMany('moderation-report')
});
