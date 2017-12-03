import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import { later } from '@ember/runloop';
import Route from '@ember/routing/route';
import PostNavRouteMixin from 'client/mixins/post-nav-route';

export default Route.extend(PostNavRouteMixin, {
  currentUser: service(),
  intl: service(),
  meta: service(),

  user: alias('currentUser.user'),
  _posts: alias('controller.model'),
  _defaultQueryParams: {
  },

  afterModel(...args) {
    this._super(...args);

    this.set('meta.title', null);
  },

  model() {
    this.setProperties({
      reachedLastPost: false
    });

    const user = this.get('user');

    if (isBlank(user)) return;

    return this.store.query('post', { followerId: user.get('id'), page: 0, perPage: 10 });
  },

  _refreshPosts() {
    later(() => this.refresh(), 1000);
  }
});
