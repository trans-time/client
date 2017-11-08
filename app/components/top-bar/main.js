import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['top-bar'],

  meta: service(),
  router: service(),

  title: oneWay('meta.title'),

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
