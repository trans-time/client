import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  // orderedPosts: Ember.computed('posts.[]', {
  //   get() {
  //     return this.get('posts').toArray().sort((a, b) => {
  //       return a.get('date') - b.get('date');
  //     });
  //   }
  // }),

  post: Ember.computed('initialPostId', 'posts.[]', {
    get() {
      const { initialPostId, posts } = this.getProperties('initialPostId', 'posts');

      return Ember.isPresent(initialPostId) ? posts.findBy('id', initialPostId) : posts.get('firstObject');
    }
  }),

  actions: {
    changePost(post) {
      this.set('post', post);
    },

    loadMorePosts(resolve, reject) {
      this.sendAction('action', resolve, reject)
    }
  }
});
