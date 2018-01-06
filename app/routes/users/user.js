import { isPresent } from '@ember/utils';
import Route from '@ember/routing/route';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(RouteTitleMixin, {
  linkRoute: 'users.user.profile.index',

  model(params) {
    const peekedUser = this.store.peekAll('user').find((user) => user.get('username') === params.username);
    const fullyLoaded = isPresent(peekedUser) && peekedUser.belongsTo('userProfile').value() !== null && peekedUser.belongsTo('userProfile').value().belongsTo('userTagSummary').value() !== null;

    return fullyLoaded ? peekedUser : this.store.queryRecord('user', { username: params.username, include: 'userProfile, userProfile.userTagSummary, userProfile.userTagSummary.tags, userProfile.userTagSummary.relationships, userIdentities, userIdentities.identity', reload: true });
  },

  afterModel(model) {
    this.set('linkModelId', model.get('username'));
    this.set('titleToken', model.get('username'));

    this._super(...arguments);
  }
});
