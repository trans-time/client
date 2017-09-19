import Ember from 'ember';

export default Ember.Component.extend({
  modalManager: Ember.inject.service('modal-manager'),
  session: Ember.inject.service('session'),

  actions: {
    signIn() {
      this.get('modalManager').open('auth-sign-in');
    },

    signOut() {
      this.get('session').invalidate();
    },

    signUp() {
      this.get('modalManager').open('auth-sign-up');
    }
  }
});
