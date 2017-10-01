import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  tagCategory: belongsTo('tag-category'),
  userTagSummary: hasMany('user-tag-summary')
});
