import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('violation-report', params.id, {
      include: 'indicted, indicted.indictions, indicted.indictions.flags, flags, flaggable, flaggable.textVersions, flaggable.panels, flaggable.post, flaggable.post.textVersions, flaggable.post.panels, flaggable.post.user'
    });
  },

  actions: {
    deletePost(post, resolve) {
      post.destroyRecord().finally(() => resolve());
    },

    loadMorePosts(resolve, reject, shouldProgress) {
      resolve(shouldProgress ? { reachedFirstPost: true } : { reachedLastPost: true });
    }
  }
});
