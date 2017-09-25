import Ember from 'ember';
import RouteTitleMixin from 'client/mixins/route-title';

export default Ember.Route.extend(RouteTitleMixin, {
  model(params) {
    return this.store.findRecord('user', params.id);
  },

  afterModel(user) {
    this.set('title', user.get('username'));

    this._super(...arguments);
  }
});
