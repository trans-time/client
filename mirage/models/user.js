import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  blockers: hasMany('block', { inverse: 'blocked' }),
  blockeds: hasMany('block', { inverse: 'blocker' }),
  comments: hasMany('comment'),
  reactions: hasMany('reaction'),
  followers: hasMany('follow', { inverse: 'followed' }),
  followeds: hasMany('follow', { inverse: 'follower' }),
  indictions: hasMany('moderation-report', { inverse: 'indicted' }),
  notifications: hasMany('notification', { polymorphic: true, inverse: 'user' }),
  posts: hasMany('post', { inverse: 'user' }),
  searchQueries: hasMany('search-query'),
  tags: hasMany('tag'),
  userIdentities: hasMany('user-identity'),
  moderationReports: hasMany('moderation-report', { inverse: 'moderator' }),

  currentUser: belongsTo('current-user'),
  userProfile: belongsTo('user-profile')
});
