import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['tags', 'relationships', 'direction', 'postId', 'comments'],
  direction: null,
  postId: null,
  comments: null,
  tags: [],
  relationships: [],

  actions: {
    changePost(post) {
      this.set('postId', post.id);
    },

    openComments() {
      this.set('comments', true);
    },

    closeComments() {
      this.set('comments', undefined);
    }
  }
});
