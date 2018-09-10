import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  perPageParam: 'page_size',

  currentUser: service(),
  infinity: service(),
  intl: service(),
  topBarManager: service(),

  model() {
    return this.infinity.model('notification', { sort: '-updated_at', perPage: 12, startingPage: 1 });
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('notifications.notifications');

    this.get('topBarManager').setTitle(title);
    this.set('titleToken', title);
  }
});
