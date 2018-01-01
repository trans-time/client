import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['tags', 'relationships', 'direction', 'postId'],
  direction: null,
  postId: null,
  tags: [],
  relationships: [],

  actions: {
    changePost(post) {
      this.set('postId', post.id);
    }
  }
});
