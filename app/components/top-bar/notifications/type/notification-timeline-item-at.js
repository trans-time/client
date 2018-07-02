import Component from '@ember/component';
import NotificationComponentMixin from 'client/mixins/notification-component';

export default Component.extend(NotificationComponentMixin, {
  transitionToNotification() {
    this.get('router').transitionTo('timeline-items.timeline-item', this.get('notification.notifiable.timelineItem.id'));
  }
});
