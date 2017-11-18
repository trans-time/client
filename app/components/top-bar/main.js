import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['top-bar'],

  searchValue: '',

  meta: service(),
  router: service(),

  title: oneWay('meta.title'),

  showSearchBar: computed('router.currentRouteName', {
    get() {
      return this.get('router.currentRouteName') === 'index';
    }
  }),

  actions: {
    home() {
      return this.get('router').transitionTo('application');
    },

    search() {
      const searchValue = this.get('searchValue');

      if (searchValue === '') this.$('input').focus();
    },

    toggleMenu() {
      this.toggleProperty('menuIsOpen');
    }
  }
});
