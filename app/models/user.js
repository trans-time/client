import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  identities: DS.hasMany('identity'),
  posts: DS.hasMany('post', { async: true }),

  username: DS.attr('string'),

  tags: computed('posts.@each.tag', {
    get() {
      return this.get('posts').toArray().reduce((tags, post) => tags.concat(post.get('tags').toArray()), Ember.A()).uniq();
    }
  })
});
