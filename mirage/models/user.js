import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  faves: hasMany('fav'),
  posts: hasMany('post'),
  tags: hasMany('tag'),
  userProfile: belongsTo('user-profile'),
  userConfiguration: belongsTo('user-configuration')
});
