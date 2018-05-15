import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('comment', params.id, { include: 'timeline_item,timeline_item.post,timeline_item.post.images,timeline_item.user' });
  }
});
