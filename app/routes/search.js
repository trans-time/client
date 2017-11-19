import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(RouteTitleMixin, {
  queryParams: {
    query: {
      refreshModel: true
    }
  },

  messageBus: service(),
  intl: service(),

  afterModel(...args) {
    this._super(...args);

    this.set('meta.title', args[1].queryParams.query);
  },

  init(...args) {
    this._super(...args);

    this.get('messageBus').subscribe('userWasAuthenticated', this, this._refreshPosts);
  },

  model(params) {
    this.setProperties({
      reachedLastPost: false
    });

    return this.store.query('post', { query: params.query, page: 0, perPage: 10 });
  },

  _refreshPosts() {
    const query = this.get('controller.model.posts.query');
    const originalQueryClone = assign({}, query);

    query.perPage = (query.page + 1) * query.perPage;
    query.page = 0;

    this.store.query('post', query).then(() => {
      this.set('controller.model.posts.query', originalQueryClone);
    });
  },

  actions: {
    willTransition() {
      const controller = this.controllerFor('search');

      controller.setProperties({
        query: ''
      });
    },

    loadMorePosts(resolve, reject) {
      const query = this.get('controller.model.query');

      query.page++;

      this.store.query('post', query).then((posts) => {
        this.get('controller.model').pushObjects(posts.get('content'));

        resolve(posts.get('content.length') < query.perPage);
      }).catch(() => {
        reject();
      });
    }
  }
});
