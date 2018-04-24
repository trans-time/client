import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('flag', params.id, {
      include: 'moderation_report,moderation_report.verdicts,moderation_report.verdicts.moderator,post,comment'
    });
  }
});
