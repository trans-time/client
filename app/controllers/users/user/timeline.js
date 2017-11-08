import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['tags', 'direction'],
  direction: null,
  tags: []
});
