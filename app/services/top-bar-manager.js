import Service from '@ember/service';
import { assign } from '@ember/polyfills';
import { inject as service } from '@ember/service';

export default Service.extend({
  router: service(),

  setTitleLink(name, linkRoute, linkModelId) {
    this._setProperties({
      title: {
        name,
        linkRoute,
        linkModelId
      }
    });
  },

  setTitle(name) {
    this._setProperties({
      title: {
        name
      }
    });
  },

  showSearchBar() {
    const action = (args) => {
      if (args.searchValue === '') document.getElementById('top_bar_search').focus();
      else {
        this.get('router').transitionTo('search', { queryParams: { query: args.searchValue }});
      }
    };

    this._setProperties({
      canSearch: true,
      icon: {
        name: 'search',
        action,
        args: {}
      }
    });
  },

  _setProperties(properties) {
    const action = () => {
      this.get('router').transitionTo('application');
    };

    this.setProperties(assign({
      canSearch: false,
      icon: 'home',
      title: null,
      icon: {
        name: 'home',
        action,
        args: {}
      }
    }, properties));
  }
});
