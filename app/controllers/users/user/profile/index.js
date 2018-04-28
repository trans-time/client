import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['submenu', 'tags', 'users'],
  submenu: null,
  tags: [],
  users: []
});
