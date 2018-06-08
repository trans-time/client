import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import NotificationComponentMixin from 'client/mixins/notification-component';

export default Component.extend(NotificationComponentMixin, {
  currentUser: service(),

  transitionToNotification() {
    this.get('router').transitionTo('users.user.profile.followers', this.get('currentUser.user.username'));
  }
});
