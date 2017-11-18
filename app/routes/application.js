import { bind } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
  routeAfterAuthentication: null,

  currentUser: service(),
  intl: service(),
  messageBus: service(),

  init() {
    this.get('intl').setLocale('en-us');
    window.addEventListener('resize', bind(this, this._handleResize), false);
  },

  title: function(tokens) {
    tokens.push(this.get('intl').t('title'));

    return tokens.join(' | ');
  },

  beforeModel() {
    return this._loadCurrentUser();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser();
  },

  _loadCurrentUser() {
    return this.get('currentUser').load().catch(() => this.get('session').invalidate());
  },

  _handleResize() {
    window.requestAnimationFrame(() => this.get('messageBus').publish('didResize'));
  }
});
