import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('comment', params.id, { include: 'post, post.panels, post.currentUserFav' });
  }
});
