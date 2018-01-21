import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['top-bar-notifications', 'notifications'],
  tagName: 'ul',

  currentUser: service(),
  router: service(),
  store: service(),

  notifications: computed({
    get() {
      return this.get('store').query('notification', { userId: this.get('currentUser.user.id'), perPage: 7, startingPage: 1 });
    }
  }),

  actions: {
    seeAllNotifications() {
      this.attrs.toggleNotifications();
      this.get('router').transitionTo('notifications');
    }
  }
});
