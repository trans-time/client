import { assign } from '@ember/polyfills';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  messageBus: service(),

  init(...args) {
    this._super(...args);

    this.get('messageBus').subscribe('userWasAuthenticated', this, this._refreshPosts);
  },

  _refreshPosts() {
    const query = this.get('_posts.query');
    const originalQueryClone = assign({}, query);

    query.perPage = (query.page + 1) * query.perPage;
    query.page = 0;

    this.store.query('post', query).then(() => {
      this.set('_posts.query', originalQueryClone);
    });
  },

  actions: {
    willTransition() {
      const controller = this.controllerFor('users.user.timeline');

      controller.setProperties(this.get('_defaultQueryParams'));
    },

    loadMorePosts(resolve, reject, shouldProgress, fromPostId) {
      const query = this.get('_posts.query');

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
