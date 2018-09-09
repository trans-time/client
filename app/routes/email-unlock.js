import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),
  paperToaster: service(),
  topBarManager: service(),

  queryParams: {
    mailUnlockToken: {
      refreshModel: true
    }
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('mail.emailUnlock');

    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);
  },

  model(params) {
    return this.store.createRecord('emailUnlock').save({
      adapterOptions: {
        mailUnlockToken: params.mailUnlockToken
      }
    }).then(() => {
      this.get('paperToaster').show(this.get('intl').t('mail.emailUnlocked'), {
        duration: 2000
      });
      this.transitionTo('application');
    });
  }
});
