import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import NotificationComponentMixin from 'client/mixins/notification-component';

export default Component.extend(NotificationComponentMixin, {
  currentUser: service(),
  intl: service(),

  transitionToNotification() {
    this.get('router').transitionTo('comments.comment', this.get('notification.notifiable.comment.id'));
  }
});
