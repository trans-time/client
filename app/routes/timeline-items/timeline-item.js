import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('timeline-item', params.id, { include: 'content_warnings,user,post,post.images,reactions,reactions.user', reload: true });
  }
});
