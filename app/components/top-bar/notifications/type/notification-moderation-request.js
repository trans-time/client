import Component from '@ember/component';
import NotificationComponentMixin from 'client/mixins/notification-component';

export default Component.extend(NotificationComponentMixin, {
  transitionToNotification() {
    this.get('router').transitionTo('moderation.reports');
  }
});
