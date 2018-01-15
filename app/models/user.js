import { A } from '@ember/array';
import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  blockeds: DS.hasMany('block', { inverse: 'blocker' }),
  blockers: DS.hasMany('block', { inverse: 'blocked' }),
  comments: DS.hasMany('comment'),
  faves: DS.hasMany('fav'),
  followeds: DS.hasMany('follow', { inverse: 'follower' }),
  followers: DS.hasMany('follow', { inverse: 'followed' }),
  indictions: DS.hasMany('violation-report', { inverse: 'indicted' }),
  posts: DS.hasMany('post', { async: true, inverse: 'user' }),
  userIdentities: DS.hasMany('user-identity'),
  userProfile: DS.belongsTo('user-profile'),
  violationReports: DS.hasMany('violation-report', { inverse: 'moderator' }),

  isModerator: DS.attr('boolean'),
  username: DS.attr('string'),

  tags: computed('posts.@each.tag', {
    get() {
      return this.get('posts').toArray().reduce((tags, post) => tags.concat(post.get('tags').toArray()), A()).uniq();
    }
  })
});
