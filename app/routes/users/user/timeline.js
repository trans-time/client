import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    tags: {
      refreshModel: true
    }
  },

  model(params) {
    return this.store.query('post', { userId: this.modelFor('users.user').id, tags: params.tags });
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
