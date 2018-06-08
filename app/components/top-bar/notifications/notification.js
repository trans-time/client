import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'notification',
  tagName: 'li',

  currentUser: service(),

  didInsertElement(...args) {
    this._super(...args);

    if (!this.get('notification.isSeen') && this.get('currentUser.user.currentUser')) {
      this.set('notification.isSeen', true);

      this.decrementProperty('currentUser.user.currentUser.unreadNotificationCount');
    }
  },

  notificationType: computed({
    get() {
      return `top-bar/notifications/type/${this.get('notification.notifiable.constructor.modelName')}`;
    }
  })
});
