import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),
  topBarManager: service(),

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('documents.cookiePolicy');

    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);
  }
});
