import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  currentUser: service(),
  router: service(),
  store: service(),

  loading: true,

  notifications: computed({
    get() {
      this.set('loading', true);

      const notifications = this.get('store').query('notification', { sort: '-updated_at', page_size: 6, page: 1 });

      notifications.then(() => {
        this.set('loading', false)
      });

      return notifications;
    }
  }),

  actions: {
    handleClick() {
    console.log(arguments)
    },

    seeAllNotifications() {
      this.get('router').transitionTo('notifications');
    }
  }
});
