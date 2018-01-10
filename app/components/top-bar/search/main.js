import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['search-bar'],
  tagName: 'span',

  store: service(),

  _cache: computed(() => {
    return {}
  }),

  _searchTask: task(function * (query, resolveSelection) {
    const results = yield this.get(`_cache.${query}`) || this.get('store').queryRecord('search-query', { query, include: 'identities, tags, users' });

    this.setProperties({
      results,
      resolveSelection
    });
    this.set(`_cache.${query}`, results);
  }).restartable(),

  _clearResults() {
    this.set('results', undefined);
  },

  actions: {
    lookupAutocomplete(query, resolve) {
      if (isPresent(query)) this.get('_searchTask').perform(query, resolve);
      else this._clearResults();
    },

    selectTag(tag) {
      this.get('resolveSelection')(`#${tag}`);
      this._clearResults();
    },

    selectUser(username) {
      this.get('resolveSelection')(`@${username}`);
      this._clearResults();
    }
  }
});
