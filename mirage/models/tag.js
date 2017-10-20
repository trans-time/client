import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  userTagSummary: hasMany('user-tag-summary')
});
