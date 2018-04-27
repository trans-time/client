import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';

export default Route.extend({
  topBarManager: service(),

  model(params) {
    return this.store.query('user', { filter: { username: params.username }, include: 'user_profile,user_tag_summaries_about_user,user_tag_summaries_about_user.author,user_tag_summaries_about_user.user_tag_summary_tags,user_tag_summaries_about_user.user_tag_summary_tags.tag,user_tag_summaries_about_user.user_tag_summary_users,user_tag_summaries_about_user.user_tag_summary_users.user,user_identities,user_identities.identity', reload: true }).then(function(users) {
      return users.get('firstObject');
    });
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
