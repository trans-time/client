import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['direction', 'tag'],
  direction: null,
  tag: null,

  posts: Ember.computed.oneWay('model.posts'),

  filteredPosts: Ember.computed('posts', 'tag', {
    get() {
      const { posts, tag } = this.getProperties('posts', 'tag');

      return Ember.isEmpty(tag) ? posts.toArray() : posts.filter((postModel) => {
        return postModel.get('tags').toArray().any((tagModel) => tagModel.get('name') === tag);
      });
    }
  }),

  orderedPosts: Ember.computed('direction', 'filteredPosts', {
    get() {
      const { direction, filteredPosts } = this.getProperties('direction', 'filteredPosts');

      return filteredPosts.sort((a, b) => {
        return direction === 'desc' ? b.get('date') - a.get('date') : a.get('date') - b.get('date');
      });
    }
  })
});
