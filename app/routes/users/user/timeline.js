import Ember from 'ember';

export default Ember.Route.extend({
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
