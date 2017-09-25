import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    tag: {
      refreshModel: true
    }
  },

  model(params) {
    return this.store.query('post', { userId: this.modelFor('users.user').id, tag: params.tag });
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
