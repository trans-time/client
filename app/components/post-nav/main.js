import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

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
