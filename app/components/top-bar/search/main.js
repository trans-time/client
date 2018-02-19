import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: ['search-bar'],
  tagName: 'span',

  store: service(),

  _cache: computed(() => {
    return {}
  }),

  _searchTask: task(function * (query, cursorIndex, resolveSelection) {
    yield timeout(250);

    const results = yield this.get(`_cache.${query}`) || this.get('store').queryRecord('search-query', { filter: { query }, include: 'identities,tags,users' });

    this.setProperties({
      cursorIndex,
      results,
      resolveSelection
    });
    this.set(`_cache.${query}`, results);
  }).restartable(),

  _clearResults() {
    this.get('_searchTask').cancelAll();
    this.set('results', undefined);
  },

  _focusInput() {
    const input = this.element.querySelector('input');
    input.focus();
    input.selectionStart = this.get('cursorIndex');
    input.selectionEnd = input.selectionStart;
  },

  actions: {
    cancel() {
      this._clearResults();
      this._focusInput();
    },

    lookupAutocomplete(query, cursorIndex, resolve) {
      if (isPresent(query) && query !== '#' && query !== '@' && query !== '*') this.get('_searchTask').perform(query, cursorIndex, resolve);
      else this._clearResults();
    },

    navDown() {
      const $items = this.$('.search-bar-results-group-item');
      const focusIndex = $items.index(document.activeElement);
      const $newItem = $items[focusIndex + 1];

      $newItem ? $newItem.focus() : this._focusInput();
    },

    navUp() {
      const $items = this.$('.search-bar-results-group-item');
      const focusIndex = $items.index(document.activeElement);

      if (focusIndex === -1) $items[$items.length - 1].focus();
      else if (focusIndex === 0) this._focusInput();
      else $items[focusIndex - 1].focus();
    },

    selectIdentity(identity) {
      this.get('resolveSelection')(`*${identity}`);
      this._clearResults();
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
