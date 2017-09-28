import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    tags: {
      refreshModel: true
    }
  },

  model(params) {
    this.setProperties({
      reachedLastPost: false
    });

    const user = this.modelFor('users.user');

    return Ember.RSVP.hash({
      posts: this.store.query('post', { userId: user.id, tags: params.tags, page: 0, perPage: 10 }),
      user
    });
  },

  actions: {
    willTransition() {
      const controller = this.controllerFor('users.user.timeline');

      controller.setProperties(controller.get('queryParams').reduce((properties, property) => {
        properties[property] = null;

        return properties;
      }, {}));
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
