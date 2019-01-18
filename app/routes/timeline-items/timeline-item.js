import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('timeline-item', params.id, { include: 'tags,user,post,post.images,reactions,reactions.user', reload: true });
  }
});
