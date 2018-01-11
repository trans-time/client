import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  blockers: hasMany('block', { inverse: 'blocked' }),
  blockeds: hasMany('block', { inverse: 'blocker' }),
  comments: hasMany('comment'),
  faves: hasMany('fav'),
  followers: hasMany('follow', { inverse: 'followed' }),
  followeds: hasMany('follow', { inverse: 'follower' }),
  posts: hasMany('post', { inverse: 'user' }),
  searchQueries: hasMany('search-query'),
  tags: hasMany('tag'),
  userIdentities: hasMany('user-identity'),

  currentUser: belongsTo('current-user'),
  userProfile: belongsTo('user-profile')
});
