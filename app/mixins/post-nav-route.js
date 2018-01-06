import { assign } from '@ember/polyfills';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: {
    postId: {
      replace: true
    }
  },

  messageBus: service(),
  router: service(),

  init(...args) {
    this._super(...args);

    this.get('messageBus').subscribe('userWasAuthenticated', this, this._refreshPosts);
  },

  _refreshPosts() {
    const query = this.get('_posts.query');
    const originalQueryClone = assign({}, query);

    query.refreshPostIds = this.get('_posts.content').map((post) => post.id).join(',');

    this.store.query('post', query).then(() => {
      this.set('_posts.query', originalQueryClone);
    });
  },

  actions: {
    willTransition() {
      const controller = this.controllerFor('users.user.timeline');

      controller.setProperties(this.get('_defaultQueryParams'));

      this.get('router.location').setURL(window.location.href);
    },

    deletePost(post, resolve) {
      post.destroyRecord().finally(() => resolve());
    },

    loadMorePosts(resolve, reject, shouldProgress, fromPostId) {
      const query = this.get('_posts.query');

      if (query.shouldProgress === shouldProgress && query.fromPostId === fromPostId) return reject();

      query.shouldProgress = shouldProgress;
      query.fromPostId = fromPostId;

      this.store.query('post', query).then((posts) => {
        this.get('_posts').pushObjects(posts.get('content'));

        const reachedEnd = posts.get('content.length') < query.perPage;

        resolve(shouldProgress ? { reachedFirstPost: reachedEnd } : { reachedLastPost: reachedEnd });
      }).catch(() => {
        reject();
      });
    }
  }
});
