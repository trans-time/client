import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';

export default Route.extend({
  topBarManager: service(),

  model(params) {
    const peekedUser = this.store.peekAll('user').find((user) => user.get('username') === params.username);
    const fullyLoaded = isPresent(peekedUser) && peekedUser.belongsTo('userProfile').value() !== null && peekedUser.belongsTo('userProfile').value().belongsTo('userTagSummary').value() !== null;

    return fullyLoaded ? peekedUser : this.store.findRecord('user', params.username, { include: 'user_profile,user_profile.user_tag_summary,user_profile.user_tag_summary.tags,user_profile.user_tag_summary.users,user_identities,user_identities.identity', reload: true });
  },

  afterModel(model) {
    this.set('titleToken', model.get('username'));
    this._setTopBar(model);

    this._super(...arguments);
  },

  _setTopBar(model) {
    let title = `@${model.get('username')}`;
    if (model.get('displayName')) title = `${model.get('displayName')} ${title}`;
    this.get('topBarManager').setTitleLink(title, 'users.user.profile.index', model.get('username'));
  },

  actions: {
    updateModel(model) {
      this._setTopBar(model);
    }
  }
});
