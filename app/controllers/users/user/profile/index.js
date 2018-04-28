import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['submenu', 'tags', 'relationships'],
  submenu: null,
  tags: [],
  relationships: []
});
