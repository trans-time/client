import { A } from '@ember/array';
import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  faves: DS.hasMany('fav'),
  followeds: DS.hasMany('follow', { inverse: 'follower' }),
  followers: DS.hasMany('follow', { inverse: 'followed' }),
  posts: DS.hasMany('post', { async: true, inverse: 'user' }),
  userIdentities: DS.hasMany('user-identity'),
  userProfile: DS.belongsTo('user-profile'),

  username: DS.attr('string'),

  tags: computed('posts.@each.tag', {
    get() {
      return this.get('posts').toArray().reduce((tags, post) => tags.concat(post.get('tags').toArray()), A()).uniq();
    }
  })
});
