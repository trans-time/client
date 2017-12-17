import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  comments: hasMany('comment'),
  faves: hasMany('fav'),
  followers: hasMany('follow', { inverse: 'followed' }),
  followeds: hasMany('follow', { inverse: 'follower' }),
  posts: hasMany('post', { inverse: 'user' }),
  tags: hasMany('tag'),
  userIdentities: hasMany('user-identity'),

  currentUser: belongsTo('current-user'),
  userProfile: belongsTo('user-profile')
});
