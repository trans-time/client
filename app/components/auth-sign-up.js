import Ember from 'ember';

export default Ember.Component.extend({
  modalManager: Ember.inject.service('modal-manager'),
  store: Ember.inject.service('store'),

  user: Ember.computed({
    get() {
      return this.get('store').createRecord('user');
    }
  }),

  actions: {
    complete() {
      this.get('modalManager').close();
    }
  }
});
