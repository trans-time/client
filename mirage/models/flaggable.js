import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  flags: hasMany('flag', { inverse: 'flaggable' }),
  violationReports: hasMany('violation-report')
});
