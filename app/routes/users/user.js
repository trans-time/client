import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';

export default Route.extend({
  topBarManager: service(),

  model(params) {
    const peekedUser = this.store.peekAll('user').find((user) => user.get('username') === params.username);
    const fullyLoaded = isPresent(peekedUser) && peekedUser.belongsTo('userProfile').value() !== null && peekedUser.belongsTo('userProfile').value().belongsTo('userTagSummary').value() !== null;

    return fullyLoaded ? peekedUser : this.store.queryRecord('user', { username: params.username, include: 'userProfile, userProfile.userTagSummary, userProfile.userTagSummary.tags, userProfile.userTagSummary.relationships, userIdentities, userIdentities.identity', reload: true });
  },

  afterModel(model) {
    this.set('titleToken', model.get('username'));
    this._setTopBar(model);

    this._super(...arguments);
  },

  _setTopBar(model) {
    this.get('topBarManager').setTitleLink(`${model.get('userProfile.displayName')} @${model.get('username')}`, 'users.user.profile.index', model.get('username'));
  },

  actions: {
    updateModel(model) {
      this._setTopBar(model);
    }
  }
});
