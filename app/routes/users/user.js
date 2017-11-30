import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(RouteTitleMixin, {
  linkRoute: 'users.user',

  model(params) {
    const { id } = params;

    this.set('linkModelId', id);

    return hash({
      user: this.store.findRecord('user', id),
      userProfile: this.store.findRecord('user-profile', id)
    });
  },

  afterModel(model) {
    this.set('titleToken', model.user.get('username'));

    this._super(...arguments);
  }
});
