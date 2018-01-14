import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  flaggable: belongsTo('flaggable', { polymorphic: true }),
  flags: hasMany('flag'),
  indicted: belongsTo('user', { inverse: 'indictions' }),
  moderator: belongsTo('user', { inverse: 'violationReports' })
});
