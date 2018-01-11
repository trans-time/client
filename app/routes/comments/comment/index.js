import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),
  topBarManager: service(),

  afterModel() {
    const title = this.get('intl').t('post.viewPost');
    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);

    this._super(...arguments);
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
