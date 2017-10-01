import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    tags: {
      refreshModel: true
    }
  },

  messageBus: Ember.inject.service(),

  init(...args) {
    this._super(...args);

    this.get('messageBus').subscribe('userWasAuthenticated', this, this._refreshPosts);
  },

  model(params) {
    this.setProperties({
      reachedLastPost: false
    });

    const user = this.modelFor('users.user').user;

    return Ember.RSVP.hash({
      posts: this.store.query('post', { userId: user.id, tags: params.tags, page: 0, perPage: 10 }),
      user
    });
  },

  _refreshPosts() {
    const query = this.get('controller.model.posts.query');
    const originalQueryClone = Ember.assign({}, query);

    query.perPage = (query.page + 1) * query.perPage;
    query.page = 0;

    this.store.query('post', query).then(() => {
      this.set('controller.model.posts.query', originalQueryClone);
    });
  },

  actions: {
    willTransition() {
      const controller = this.controllerFor('users.user.timeline');

      controller.setProperties({
        tags: []
      });
    },

    loadMorePosts(resolve, reject) {
      const query = this.get('controller.model.posts.query');

      query.page++;

      this.store.query('post', query).then((posts) => {
        this.get('controller.model.posts').pushObjects(posts.get('content'));

        resolve(posts.get('content.length') < query.perPage);
      }).catch(() => {
        reject();
      });
    }
  }
});
