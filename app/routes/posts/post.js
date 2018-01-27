import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('post', params.id, { include: 'timelineItem, panels, currentUserReaction, user' });
  }
});
