import { A } from '@ember/array';
import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  faves: DS.hasMany('fav'),
  identities: DS.hasMany('identity'),
  posts: DS.hasMany('post', { async: true }),
  userProfile: DS.belongsTo('user-profile'),
  userSettings: DS.belongsTo('user-settings'),

  username: DS.attr('string'),

  tags: computed('posts.@each.tag', {
    get() {
      return this.get('posts').toArray().reduce((tags, post) => tags.concat(post.get('tags').toArray()), A()).uniq();
    }
  })
});
