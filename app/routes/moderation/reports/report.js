import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('moderation-report', params.id, {
      include: 'indicted,indicted.indictions,indicted.indictions.flags,flags,post,post.text_versions,post.images,post.timeline_item.user,comment,comment.text_versions,comment.images,comment.timeline_item.user',
      reload: true
    });
  },

  actions: {
    deleteTimelineable(post, resolve) {
      post.destroyRecord().finally(() => resolve());
    },

    loadMoreTimelineItems(resolve, reject, shouldProgress) {
      resolve(shouldProgress ? { reachedFirstPost: true } : { reachedLastPost: true });
    }
  }
});
