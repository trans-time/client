import { assign } from '@ember/polyfills';
import { alias } from '@ember/object/computed';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import PostNavRouteMixin from 'client/mixins/post-nav-route';

export default Route.extend(PostNavRouteMixin, {
  queryParams: {
    tags: {
      refreshModel: true
    }
  },

  _posts: alias('controller.model.posts'),
  _defaultQueryParams: {
    tags: [],
    relationships: [],
    direction: null
  },

  model(params) {
    this.setProperties({
      reachedLastPost: false
    });

    const user = this.modelFor('users.user').user;

    return hash({
      posts: this.store.query('post', { userId: user.id, tags: params.tags, direction: params.direction, page: 0, perPage: 10 }),
      user
    });
  }
});
