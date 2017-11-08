import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(RouteTitleMixin, {
  model(params) {
    return hash({
      user: this.store.findRecord('user', params.id),
      userTagSummary: this.store.findRecord('user-tag-summary', params.id)
    });
  },

  afterModel(model) {
    this.set('title', model.user.get('username'));

    this._super(...arguments);
  }
});
