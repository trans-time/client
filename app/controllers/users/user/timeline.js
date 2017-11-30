import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['tags', 'relationships', 'direction'],
  direction: null,
  tags: [],
  relationships: []
});
