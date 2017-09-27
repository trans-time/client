import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  orderedPosts: Ember.computed('posts', {
    get() {
      return this.get('posts').toArray().sort((a, b) => {
        return a.get('date') - b.get('date');
      });
    }
  }),

  post: Ember.computed('initialPostId', 'orderedPosts.[]', {
    get() {
      const { initialPostId, orderedPosts } = this.getProperties('initialPostId', 'orderedPosts');

      return Ember.isPresent(initialPostId) ? orderedPosts.findBy('id', initialPostId) : orderedPosts.get('firstObject');
    }
  }),

  actions: {
    changePost(post) {
      this.set('post', post);
    }
  }
});
