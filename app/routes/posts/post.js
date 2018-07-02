import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('post', params.id, { include: 'timeline_item,timeline_item.user,images' });
  }
});
