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
    lastPost: null,
    postId: null,
    comments: null
  },

  model(params) {
    this.setProperties({
      reachedFirstPost: false,
      reachedLastPost: false
    });

    const user = this.modelFor('users.user');

    return hash({
      posts: this.store.query('post', { userId: user.id, tags: params.tags, direction: params.direction, fromPostId: params.postId, lastPost: params.lastPost, perPage: 5 }),
      user
    });
  }
});
