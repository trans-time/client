import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  userTagSummary: hasMany('user-tag-summary')
});
