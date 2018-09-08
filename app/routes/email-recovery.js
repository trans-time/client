import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),
  paperToaster: service(),
  topBarManager: service(),

  queryParams: {
    mailRecoveryToken: {
      refreshModel: true
    }
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('mail.emailRecovery');

    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);
  },

  model(params) {
    return this.store.createRecord('emailRecovery').save({
      adapterOptions: {
        mailRecoveryToken: params.mailRecoveryToken
      }
    }).then(() => {
      this.get('paperToaster').show(this.get('intl').t('mail.emailRestored'), {
        duration: 2000
      });
      this.transitionTo('application');
    });
  }
});
