import Route from '@ember/routing/route';

export default Route.extend({
  resetController(controller) {
    controller.setProperties({
      tags: [],
      relationships: [],
      submenu: null
    });

    this._super(...arguments);
  },

  model(params) {
    return this.store.query('user-tag-summary', { filter: { subject_id: this.modelFor('users.user').id, author_usernames: [this.modelFor('users.user').get('username'), ...params.relationships] }, include: 'subject,author,user_tag_summary_tags,user_tag_summary_tags.tag,user_tag_summary_users,user_tag_summary_users.user' });
  },

  actions: {
    addUserTagSummary(author_username) {
      this.store.query('user-tag-summary', { filter: { subject_id: this.modelFor('users.user').id, author_username }, include: 'subject,author,user_tag_summary_tags,user_tag_summary_tags.tag,user_tag_summary_users,user_tag_summary_users.user' }).then((userTagSummary) => {
        if (userTagSummary.get('content.length') < 0) {
          this.controllerFor('users.user.profile.index').get('model').pushObject(userTagSummary.get('content.firstObject'));
        }
      });
    }
  }
});
