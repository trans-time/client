import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import NotificationComponentMixin from 'client/mixins/notification-component';

export default Component.extend(NotificationComponentMixin, {
  currentUser: service(),

  transitionToNotification() {
    this.get('router').transitionTo('comments.comment.reactions', this.get('notification.notifiable.comment.id'));
  },

  reactorUsernames: computed({
    get() {
      const usernames = this.get('notification.notifiable.comment.reactions').map((reaction) => {
        return reaction.get('user.displayName') || reaction.get('user.username');
      }).slice(0, 2).map((username) => `<strong>${username}</strong>`);
      const reactorCount = this.get('notification.notifiable.comment.reactionCount') - usernames.length;

      switch (reactorCount) {
        case 0: return this._listWithAnd(usernames);
        case 1: return this._listWithAnd(usernames.concat(['1 other']));
        default: return this._listWithAnd(usernames.concat([`${reactorCount} others`]));
      }
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
