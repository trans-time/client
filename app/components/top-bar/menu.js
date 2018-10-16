import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  currentUser: service(),
  modalManager: service(),
  router: service(),
  session: service(),

  actions: {
    feedback() {
      this.get('router').transitionTo('feedback');
    },

    login() {
      this.get('modalManager').open('auth-modal/login');
    },

    logout() {
      this.get('session').invalidate();
    },

    toAccount() {
      this.get('router').transitionTo('account');
    },

    toMailSettings() {
      this.get('router').transitionTo('subscriptions');
    },

    toModeration() {
      this.get('router').transitionTo(this.get('currentUser.user.isModerator') ? 'moderation.reports' : 'moderation.flags');
    },

    toProfile() {
      this.get('router').transitionTo('users.user.profile', this.get('currentUser.user.username'));
    }
  }
});
