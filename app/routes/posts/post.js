import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('post', params.id, { include: 'timeline_item,timeline_item.content_warnings,timeline_item.user,timeline_item.reactions,timeline_item.reactions.user,images', reload: true });
  }
});
