import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['top-bar'],

  meta: Ember.inject.service(),
  router: Ember.inject.service(),

  title: Ember.computed.oneWay('meta.title'),

  actions: {
    back() {
      if ((new URL(document.referrer)).origin === (new URL(document.URL)).origin) {
        window.history.back();
      } else {
        const router = this.get('router');

        switch (router.get('currentRouteName')) {
          case 'users.user.timeline': return router.transitionTo('users.user.index');
          case 'users.user.index': return router.transitionTo('search.index');
        }
      }
    },

    toggleMenu() {
      this.toggleProperty('menuIsOpen');
    }
  }
});
