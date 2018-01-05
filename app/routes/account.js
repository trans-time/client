import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RouteTitleMixin from 'client/mixins/route-title';
import { inject as service } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, RouteTitleMixin, {
  intl: service(),

  beforeModel(...args) {
    this._super(...args);

    this.set('titleToken', this.get('intl').t('account.account'));
  },

  model() {
    return {
      emailChange: this.store.createRecord('email-change'),
      passwordChange: this.store.createRecord('password-change')
    }
  },

  actions: {
    changeEmail(changeset, resolve, reject) {
      changeset.save().then(() => {
        this.store.unloadAll('email-change');
        this.set('controller.model.emailChange', this.store.createRecord('email-change'));
        resolve();
      }).catch((...args) => {
        reject(...args);
      });
    },

    changePassword(changeset, resolve, reject) {
      changeset.save().then(() => {
        this.store.unloadAll('password-change');
        this.set('controller.model.passwordChange', this.store.createRecord('password-change'));
        resolve();
      }).catch((...args) => {
        reject(...args);
      });
    }
  }
});
