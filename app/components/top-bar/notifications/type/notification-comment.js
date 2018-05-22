import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import NotificationComponentMixin from 'client/mixins/notification-component';

export default Component.extend(NotificationComponentMixin, {
  currentUser: service(),

  transitionToNotification() {
    this.get('router').transitionTo('timeline_items.timeline_item', this.get('notification.notifiable.timelineItem.id'), { queryParams: { comments: true }});
  },

  ownTimelineItem: computed({
    get() {
      return this.get('notification.notifiable.timelineItem.user.id') === this.get('currentUser.user.id');
    }
  })
});
