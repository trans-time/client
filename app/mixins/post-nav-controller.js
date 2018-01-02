import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: ['postId', 'comments'],
  postId: null,
  comments: null,

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
