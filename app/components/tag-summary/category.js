import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    select(tag) {
      tag.toggleProperty('selected');
    }
  }
});
