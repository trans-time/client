import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  perPageParam: 'page_size',
  
  currentUser: service(),
  intl: service(),
  topBarManager: service(),

  model() {
    return this.infinityModel('notification', { userId: this.get('currentUser.user.id'), perPage: 12, startingPage: 1 });
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('notifications.notifications');

    this.get('topBarManager').setTitle(title);
    this.set('titleToken', title);
  }
});
