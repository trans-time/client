import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import NotificationComponentMixin from 'client/mixins/notification-component';

export default Component.extend(NotificationComponentMixin, {
  currentUser: service(),

  commentaterUsername: computed({
    get() {
      return this.get('notification.notifiable.comment.user.displayName') ||
        this.get('notification.notifiable.comment.user.username');
    }
  }),

  transitionToNotification() {
    this.get('router').transitionTo('comments.comment', this.get('notification.notifiable.comment.id'));
  },

  ownTimelineItem: computed({
    get() {
      return this.get('notification.notifiable.comment.timelineItem.user.id') === this.get('currentUser.user.id');
    }
  })
});
