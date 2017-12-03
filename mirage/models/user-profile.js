import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  user: belongsTo('user'),
  userTagSummary: belongsTo('user-tag-summary')
});
