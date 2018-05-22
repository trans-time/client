import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  perPageParam: 'page_size',

  currentUser: service(),
  intl: service(),
  topBarManager: service(),

  model() {
    return this.infinityModel('notification', { sort: '-inserted_at', perPage: 12, startingPage: 1, filter: { under_moderation: false }, include: 'user,notification_comment_at,notification_comment_at.comment,notification_comment_at.comment.user,notification_timeline_item_at,notification_timeline_item_at.timeline_item,notification_timeline_item_at.timeline_item.user,notification_comment,notification_comment.timeline_item,notification_comment.timeline_item.user' });
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('notifications.notifications');

    this.get('topBarManager').setTitle(title);
    this.set('titleToken', title);
  }
});
