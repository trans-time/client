import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    tags: {
      refreshModel: true
    }
  },

  model(params) {
    const user = this.modelFor('users.user');

    return Ember.RSVP.hash({
      posts: this.store.query('post', { userId: user.id, tags: params.tags }),
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
    }
  }
});
