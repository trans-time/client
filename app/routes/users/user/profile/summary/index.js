import Route from '@ember/routing/route';

export default Route.extend({
  resetController(controller) {
    controller.setProperties({
      tags: [],
      users: []
    });

    this._super(...arguments);
  },

  model(params) {
    return this.store.query('user-tag-summary', { filter: { subject_id: this.modelFor('users.user').id, author_ids: params.users }, include: 'subject,author,user_tag_summary_tags,user_tag_summary_tags.tag,user_tag_summary_users,user_tag_summary_users.user', reload: true });
  },
});
