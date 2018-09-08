import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),
  paperToaster: service(),
  topBarManager: service(),

  queryParams: {
    mailConfirmationToken: {
      refreshModel: true
    }
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('mail.confirmation');

    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);
  },

  model(params) {
    return this.store.createRecord('emailConfirmation').save({
      adapterOptions: {
        mailConfirmationToken: params.mailConfirmationToken
      }
    }).then(() => {
      this.get('paperToaster').show(this.get('intl').t('mail.emailConfirmed'), {
        duration: 2000
      });
      this.transitionTo('application');
    });
  }
});
