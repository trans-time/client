import { isPresent } from '@ember/utils';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(RouteTitleMixin, {
  linkRoute: 'users.user.profile.index',

  model(params) {
    const peekedUser = this.store.peekRecord('user', params.id);
    const fullyLoaded = isPresent(peekedUser) && peekedUser.belongsTo('userProfile').value() !== null && peekedUser.belongsTo('userProfile').value().belongsTo('userTagSummary').value() !== null;

    return fullyLoaded ? peekedUser : this.store.findRecord('user', params.id, { include: 'userProfile, userProfile.userTagSummary', reload: true });
  },

  afterModel(model) {
    this.set('linkModelId', model.id);
    this.set('titleToken', model.get('username'));

    this._super(...arguments);
  }
});
