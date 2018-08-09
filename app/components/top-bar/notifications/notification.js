import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'notification',
  tagName: 'li',

  currentUser: service(),

  didInsertElement(...args) {
    this._super(...args);

    if (!this.get('notification.isSeen')) {
      this.set('notification.isSeen', true);
      this.get('notification').save();

      this.decrementProperty('currentUser.user.currentUser.unseenNotificationCount');

      if (this.get('currentUser.user.currentUser.unseenNotificationCount') < 0) {
        this.set('currentUser.user.currentUser.unseenNotificationCount', 0);
      }
    }
  },

  notificationType: computed({
    get() {
      return `top-bar/notifications/type/${this.get('notification.notifiable.constructor.modelName')}`;
    }
  })
});
