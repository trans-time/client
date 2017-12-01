import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  faves: hasMany('fav'),
  followers: hasMany('follow', { inverse: 'followed' }),
  followeds: hasMany('follow', { inverse: 'follower' }),
  posts: hasMany('post', { inverse: 'user' }),
  tags: hasMany('tag'),

  currentUser: belongsTo('current-user'),
  userProfile: belongsTo('user-profile')
});
