import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['top-bar-notifications', 'notifications'],
  tagName: 'ul',

  currentUser: service(),
  router: service(),
  store: service(),

  loading: true,

  notifications: computed({
    get() {
      this.set('loading', true);

      const notifications = this.get('store').query('notification', { sort: '-updated_at', perPage: 4, startingPage: 1 });

      notifications.then(() => {
        this.set('loading', false)
      });

      return notifications;
    }
  }),

  actions: {
    seeAllNotifications() {
      this.attrs.toggleNotifications();
      this.get('router').transitionTo('notifications');
    }
  }
});
