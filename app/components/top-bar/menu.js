import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: ['top-bar-menu'],

  modalManager: Ember.inject.service(),
  router: Ember.inject.service(),
  session: Ember.inject.service(),

  actions: {
    login() {
      this.attrs.toggleMenu();
      this.get('modalManager').open('auth-modal/login');
    },

    logout() {
      this.attrs.toggleMenu();
      this.get('session').invalidate();
    }
  }
});
