import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import NotificationComponentMixin from 'client/mixins/notification-component';

export default Component.extend(NotificationComponentMixin, {
  currentUser: service(),

  transitionToNotification() {
    this.get('router').transitionTo('comments.comment', this.get('notification.notifiable.timelineItem.comments.firstObject.id'));
  },

  commentaterUsernames: computed({
    get() {
      const usernames = this.get('notification.notifiable.timelineItem.comments').mapBy('user.username').slice(0, 2).map((username) => `<strong>${username}</strong>`);
      const commenterCount = this.get('notifications.notifiable.commenterCount') - usernames.length;

      return this._listWithAnd(usernames);

      switch (commenterCount) {
        case 0: return this._listWithAnd(usernames);
        case 1: return this._listWithAnd(usernames.concat(['1 other']));
        default: return this._listWithAnd(usernames.concat([`${commenterCount} others`]));
      }
    }
  }),

  ownTimelineItem: computed({
    get() {
      return this.get('notification.notifiable.timelineItem.user.id') === this.get('currentUser.user.id');
    }
  }),

  _listWithAnd(usernames) {
    switch (usernames.length) {
      case 0: return '';
      case 1: return usernames[0];
      case 2: return `${this._listWithAnd(usernames.slice(0,1))} and ${this._listWithAnd(usernames.slice(1))}`;
      default: return `${this._listWithAnd(usernames.slice(0,1))}, ${this._listWithAnd(usernames.slice(1))}`;
    }
  }
});
