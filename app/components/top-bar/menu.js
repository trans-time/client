import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'ul',
  classNames: ['top-bar-menu'],

  modalManager: service(),
  router: service(),
  session: service(),

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
