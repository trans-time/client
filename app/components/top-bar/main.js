import { computed } from '@ember/object';
import { notEmpty, oneWay } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { EKMixin, EKOnInsertMixin, keyUp } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  classNames: ['top-bar'],

  searchValue: '',

  meta: service(),
  router: service(),

  title: oneWay('meta.title'),
  linkRoute: oneWay('meta.linkRoute'),
  linkModelId: oneWay('meta.linkModelId'),

  showLink: notEmpty('linkRoute'),

  _triggerTopBarButton: on(keyUp('KeyW'), function() {
    if (this.get('showSearchBar')) this._focusSearch();
    else this._goHome();
  }),

  showSearchBar: computed('router.currentRouteName', {
    get() {
      return this.get('router.currentRouteName') === 'index';
    }
  }),

  _goHome() {
    this.get('router').transitionTo('application');
  },

  _focusSearch() {
    this.$('input').focus();
  },

  actions: {
    home() {
      this._goHome();
    },

    search() {
      const searchValue = this.get('searchValue');

      if (searchValue === '') this._focusSearch();
      else {
        this.get('router').transitionTo('search', { queryParams: { query: searchValue }});
      }
    },

    toggleMenu() {
      this.toggleProperty('menuIsOpen');
    }
  }
});
