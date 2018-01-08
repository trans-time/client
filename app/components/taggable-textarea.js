import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { task } from 'ember-concurrency';
import textareaCaretPosition from 'client/utils/textarea-caret-position';

export default Component.extend({
  store: service(),

  classNames: ['taggable-textarea'],

  didInsertElement(...args) {
    this._super(...args);

    const textarea = this.set('textarea', this.element.querySelector('textarea'));

    ['keyup', 'mouseup', 'touchend'].forEach((type) => {
      textarea.addEventListener(type, this._currentSelectionSearch.bind(this));
    });
  },

  _currentSelectionSearch() {
    const textarea = this.get('textarea');
    const index = textarea.selectionStart;
    const value = textarea.value;
    const startOfWordIndex = value.slice(0, index).search(/[^a-zA-Z0-9_-](?=[a-zA-Z0-9_-]*$)/);

    if (textarea.value[startOfWordIndex] === '#') {
      this._searchTags(index, startOfWordIndex + 1, value);
    } else if (textarea.value[startOfWordIndex] === '@') {
      this._searchUsers(index, startOfWordIndex + 1, value);
    } else {
      this._endSearch();
    }

    this.set('startOfWordIndex', startOfWordIndex);
  },

  _endSearch() {
    this.get('_searchTask').cancelAll();
    this.set('options', undefined);
  },

  _searchTags(index, startOfWordIndex, value) {
    const word = this._getWord(index, startOfWordIndex, value);

    if (word.length > 0) this.get('_searchTask').perform('tag', { name: word, perPage: 5 });
  },

  _searchUsers(index, startOfWordIndex, value) {
    const word = this._getWord(index, startOfWordIndex, value);

    if (word.length > 0) this.get('_searchTask').perform('user', { username: word, perPage: 5 });
  },

  _searchTask: task(function * (type, query) {
    const options = yield this.get('store').query(type, query);
    const textarea = this.get('textarea');
    const position = textareaCaretPosition(textarea, this.get('startOfWordIndex'));
    this.setProperties({
      options,
      optionsStyle: htmlSafe(`top: ${position.top + 20}px; left: ${position.left}px;`)
    });
  }).restartable(),

  _getWord(index, startOfWordIndex, value) {
    let endOfWordIndex = value.slice(index).search(/[^a-zA-Z0-9_-]/);
    endOfWordIndex === -1 ? endOfWordIndex = undefined : endOfWordIndex = endOfWordIndex + index;
    return /[a-zA-Z0-9_-]*$/.exec(value.slice(startOfWordIndex, endOfWordIndex))[0];
  },

  actions: {
    select(word) {
      const textarea = this.get('textarea');
      const startOfWordIndex = this.get('startOfWordIndex') + 1;
      const endOfWordIndex = textarea.value.slice(startOfWordIndex).search(/[^a-zA-Z0-9_-]|$/) + startOfWordIndex;

      textarea.value = `${textarea.value.slice(0, startOfWordIndex)}${word}${textarea.value.slice(endOfWordIndex)}`;
      textarea.focus();
      textarea.selectionStart = startOfWordIndex + word.length;
      textarea.selectionEnd = textarea.selectionStart;
      this._endSearch();
    }
  }
});
