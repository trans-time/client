import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['tags', 'direction'],
  direction: null,
  tags: []
});
