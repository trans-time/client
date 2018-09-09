import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),
  paperToaster: service(),
  topBarManager: service(),

  queryParams: {
    mailSubscriptionToken: {
      refreshModel: true
    }
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('mail.title');

    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);
  },

  model(params) {
    this.set('mailSubscriptionToken', params.mailSubscriptionToken);

    return this.store.query('subscriptionType', {
      mail_subscription_token: params.mailSubscriptionToken,
      include: 'subscriptions'
    });
  },

  _subscribe(subscriptionType) {
    this.store.createRecord('subscription', {
      subscriptionType: subscriptionType
    }).save({
      adapterOptions: {
        mailSubscriptionToken: this.get('mailSubscriptionToken')
      }
    }).then(() => {
      this.get('paperToaster').show(this.get('intl').t('mail.successfullySubscribed', { name: subscriptionType.get('name') }), {
        duration: 2000
      });
    });
  },

  _unsubscribe(subscriptionType) {
    subscriptionType.get('subscriptions').forEach((subscription) => subscription.destroyRecord({
      adapterOptions: {
        mailSubscriptionToken: this.get('mailSubscriptionToken')
      }
    }).then(() => {
      this.get('paperToaster').show(this.get('intl').t('mail.successfullyUnsubscribed', { name: subscriptionType.get('name') }), {
        duration: 2000
      });
    }));
  },

  actions: {
    toggleSubscription(subscriptionType, subscribe) {
      if (subscribe) {
        this._subscribe(subscriptionType);
      } else {
        this._unsubscribe(subscriptionType);
      }
    },

    unsubscribeFromAll(subscriptionTypes) {
      subscriptionTypes.forEach((subscriptionType) => {
        this._unsubscribe(subscriptionType);
      });
    }
  }
});
