import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  intl: service(),
  topBarManager: service(),

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('suggestions.title');

    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);
  }
});
