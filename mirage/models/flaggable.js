import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  flags: hasMany('flag', { inverse: 'flaggable' }),
  moderationReports: hasMany('moderation-report'),
  textVersions: hasMany('text-version')
});
