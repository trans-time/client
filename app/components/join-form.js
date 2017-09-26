import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    complete() {
      this.get('modalManager').close();
    }
  }
});
