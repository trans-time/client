import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateConfirmation,
  validatePresence,
  validateLength
} from 'ember-changeset-validations/validators';

const PasswordValidations = {
  password: [
    validatePresence(true),
    validateLength({ min: 6 })
  ],
  passwordConfirmation: [
    validatePresence(true),
    validateConfirmation({ on: 'password' })
  ]
};

export default Route.extend({
  intl: service(),
  paperToaster: service(),
  topBarManager: service(),

  queryParams: {
    mailPasswordResetToken: {
      refreshModel: true
    }
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('mail.emailPasswordReset');

    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);
  },

  model(params) {
    this.set('mailPasswordResetToken', params.mailPasswordResetToken);
    return new Changeset(this.store.createRecord('email-password-reset'), lookupValidator(PasswordValidations), PasswordValidations);
  },

  actions: {
    submit(changeset, resolve, reject) {
      changeset.save({
        adapterOptions: {
          mailPasswordResetToken: this.get('mailPasswordResetToken')
        }
      }).then(() => {
        this.get('paperToaster').show(this.get('intl').t('mail.emailPasswordResetComplete'), {
          duration: 2000
        });
        this.store.unloadAll('email-password-reset');
        this.transitionTo('application');
      }).finally(() => resolve());
    }
  }
});
