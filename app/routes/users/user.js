import Ember from 'ember';
import RouteTitleMixin from 'client/mixins/route-title';

export default Ember.Route.extend(RouteTitleMixin, {
  model(params) {
    return Ember.RSVP.hash({
      user: this.store.findRecord('user', params.id),
      userTagSummary: this.store.findRecord('user-tag-summary', params.id)
    });
  },

  afterModel(model) {
    this.set('title', model.user.get('username'));

    this._super(...arguments);
  }
});
