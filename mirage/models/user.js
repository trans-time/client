import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  faves: hasMany('fav'),
  posts: hasMany('post'),
  tags: hasMany('tag'),
  userTagSummary: belongsTo('user-tag-summary'),
  userConfiguration: belongsTo('user-configuration')
});
