import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'ul',
  classNames: ['top-bar-menu'],

  currentUser: service(),
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
    },

    toAccount() {
      this.attrs.toggleMenu();
      this.get('router').transitionTo('account');
    },

    toModeration() {
      this.attrs.toggleMenu();
      this.get('router').transitionTo(this.get('currentUser.user.isModerator') ? 'moderation.reports' : 'moderation.flags');
    },

    toProfile() {
      this.attrs.toggleMenu();
      this.get('router').transitionTo('users.user.profile', this.get('currentUser.user.username'));
    },

    newPost() {
      this.attrs.toggleMenu();
      this.get('router').transitionTo('posts.new');
    }
  }
});
