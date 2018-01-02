import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import PostNavRouteMixin from 'client/mixins/post-nav-route';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(PostNavRouteMixin, RouteTitleMixin, {
  queryParams: {
    query: {
      refreshModel: true
    }
  },

  intl: service(),

  _posts: alias('controller.model'),
  _defaultQueryParams: {
    query: '',
    postId: null,
    comments: null
  },

  afterModel(...args) {
    this._super(...args);

    this.set('meta.title', args[1].queryParams.query);
  },

  model(params) {
    this.setProperties({
      reachedFirstPost: false,
      reachedLastPost: false
    });

    return this.store.query('post', { query: params.query, fromPostId: params.postId, perPage: 5 });
  }
});
