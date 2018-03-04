import Component from '@ember/component';
import { computed } from '@ember/object';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { task } from 'ember-concurrency';
import { getCode } from 'ember-keyboard';
import textareaCaretPosition from 'client/utils/textarea-caret-position';

export default Component.extend({
  store: service(),

  classNames: ['taggable-textarea'],

  cache: computed(() => {
    return {
      tag: {},
      user: {}
    }
  }),

  didInsertElement(...args) {
    this._super(...args);

    const textarea = this.set('textarea', this.element.querySelector('textarea'));

    ['keyup', 'mouseup', 'touchend'].forEach((type) => {
      textarea.addEventListener(type, this._currentSelectionSearch.bind(this));
    });
    textarea.addEventListener('scroll', this._endSearch.bind(this));
  },

  _currentSelectionSearch(event) {
    const options = this.get('options');
    const code = getCode(event);

    if (options && code === 'Escape') return next(() => this._cancel(event.preventDefault()));
    else if (options && code === 'ArrowDown') return next(() => this._navDown(event.preventDefault()));
    else if (options && code === 'ArrowUp') return next(() => this._navUp(event.preventDefault()));

    const textarea = this.get('textarea');
    const index = textarea.selectionStart;
    const value = textarea.value;
    const startOfWordIndex = value.slice(0, index).search(/[^a-zA-Z0-9_-](?=[a-zA-Z0-9_-]*$)/);
    let endOfWordIndex = value.slice(index).search(/[^a-zA-Z0-9_-]/);
    endOfWordIndex === -1 ? endOfWordIndex = value.length : endOfWordIndex = endOfWordIndex + index;

    if (textarea.value[startOfWordIndex] === '#') {
      this._searchTags(index, startOfWordIndex + 1, endOfWordIndex);
    } else if (textarea.value[startOfWordIndex] === '@') {
      this._searchUsers(index, startOfWordIndex + 1, endOfWordIndex);
    } else {
      this._endSearch();
    }

    this.setProperties({
      startOfWordIndex,
      endOfWordIndex,
      cursorIndex: index
    });
  },

  _endSearch() {
    this.get('_searchTask').cancelAll();
    this.set('options', undefined);
  },

  _searchTags(index, startOfWordIndex, endOfWordIndex) {
    const word = this._getWord(index, startOfWordIndex, endOfWordIndex);

    if (word.length > 0) this.get('_searchTask').perform('tag', word, { name: word, perPage: 5 });
  },

  _searchUsers(index, startOfWordIndex, endOfWordIndex) {
    const word = this._getWord(index, startOfWordIndex, endOfWordIndex);

    if (word.length > 0) this.get('_searchTask').perform('user', word, { username: word, perPage: 5 });
  },

  _searchTask: task(function * (type, word, query) {
    yield timeout(250);

    if (query.length < 3) return;

    const cache = this.get(`cache.${type}.${word}`);
    const options = yield cache || this.get('store').query(type, query);
    const textarea = this.get('textarea');
    this.set(`cache.${type}.${word}`, options);
    next(() => {
      let optionsStyle;
      let position = textareaCaretPosition(textarea, this.get('startOfWordIndex'));
      if (position.left > this.element.clientWidth / 2) {
        position = textareaCaretPosition(textarea, this.get('endOfWordIndex'));
        optionsStyle = `right:${this.element.clientWidth - position.left}px;`;
      } else {
        optionsStyle = `left:${position.left}px;`;
      }
      if (position.top + 20 > this.element.clientHeight / 2) {
        optionsStyle += `bottom:${this.element.clientHeight - (position.top - textarea.scrollTop)}px`;
      } else {
        optionsStyle += `top:${position.top + 20 - textarea.scrollTop}px`;
      }
      this.setProperties({
        options,
        optionsStyle: htmlSafe(optionsStyle)
      });
    });
  }).restartable(),

  _getWord(index, startOfWordIndex, endOfWordIndex) {
    return /[a-zA-Z0-9_-]*$/.exec(this.get('textarea').value.slice(startOfWordIndex, endOfWordIndex))[0];
  },

  _cancel() {
    this._returnFocus(this.get('cursorIndex'));
    this._endSearch();
  },

  _navDown() {
    const $items = this.$('.taggable-textarea-option');
    const focusIndex = $items.index(document.activeElement);
    const $newItem = $items[focusIndex + 1];

    $newItem ? $newItem.focus() : this._returnFocus(this.get('cursorIndex'));
  },

  _navUp() {
    const $items = this.$('.taggable-textarea-option');
    const focusIndex = $items.index(document.activeElement);

    if (focusIndex === -1) $items[$items.length - 1].focus();
    else if (focusIndex === 0) this._returnFocus(this.get('cursorIndex'));
    else $items[focusIndex - 1].focus();
  },

  _returnFocus(index) {
    const textarea = this.get('textarea');
    textarea.focus();
    textarea.selectionStart = index;
    textarea.selectionEnd = textarea.selectionStart;
  },

  actions: {
    cancel() {
      this._cancel();
    },

    navDown() {
      this._navDown();
    },

    navUp() {
      this._navUp();
    },

    select(word) {
      const textarea = this.get('textarea');
      const startOfWordIndex = this.get('startOfWordIndex') + 1;
      const endOfWordIndex = this.get('endOfWordIndex');

      textarea.value = `${textarea.value.slice(0, startOfWordIndex)}${word}${textarea.value.slice(endOfWordIndex)}`;
      this._returnFocus(startOfWordIndex + word.length);
      this._endSearch();
    }
  }
});
