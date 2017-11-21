import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(RouteTitleMixin, {
  model(params) {
    return hash({
      user: this.store.findRecord('user', params.id),
      userProfile: this.store.findRecord('user-profile', params.id)
    });
  },

  afterModel(model) {
    this.set('titleToken', model.user.get('username'));

    this._super(...arguments);
  }
});
