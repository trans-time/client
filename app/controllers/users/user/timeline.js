import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['direction', 'tag'],
  direction: null,
  tag: null
});
