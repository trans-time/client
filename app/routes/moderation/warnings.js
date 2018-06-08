import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),
  topBarManager: service(),

  afterModel() {
    const title = this.get('intl').t('moderation.warnings');
    this.set('titleToken', title);
    this.get('topBarManager').setTitleLink(title, 'moderation.warnings.index');

    this._super(...arguments);
  }
});
