import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('moderation-report', params.id, {
      include: 'flags,comment,post,verdicts,verdicts.moderator'
    });
  }
});
