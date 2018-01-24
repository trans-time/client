import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ModeratorsOnlyRoute from 'client/mixins/moderators-only-route';

export default Route.extend(ModeratorsOnlyRoute, {
  intl: service(),
  topBarManager: service(),

  afterModel() {
    const title = this.get('intl').t('moderation.warnings');
    this.set('titleToken', title);
    this.get('topBarManager').setTitleLink(title, 'moderation.warnings.index');

    this._super(...arguments);
  }
});
