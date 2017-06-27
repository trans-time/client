import Ember from 'ember';

export default Ember.Service.extend({
  componentPath: '',

  open(componentPath) {
    this.set('componentPath', componentPath);
  },

  close() {
    this.set('componentPath', '');
  }
});
