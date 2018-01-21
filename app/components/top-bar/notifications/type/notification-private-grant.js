import Component from '@ember/component';
import { computed } from '@ember/object';
import NotificationComponentMixin from 'client/mixins/notification-component';

export default Component.extend(NotificationComponentMixin, {
  transitionToNotification() {
    console.log(this.get('notification.followed.id'))
    this.get('router').transitionTo('users.user.profile', this.get('notification.followed.username'));
  },

  otherGrants: computed({
    get() {
      return this.get('notification.totalGrants') - 1;
    }
  })
});
