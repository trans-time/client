import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('moderation-warning', params.id, {
      include: 'moderationReport, moderationReport.flaggable, moderationReport.flags'
    });
  }
});
