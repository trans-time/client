import TextField from '@ember/component/text-field';
import { on } from '@ember/object/evented';
import { task } from 'ember-concurrency';
import { EKOnFocusMixin, keyDown } from 'ember-keyboard';
import { Promise } from 'rsvp';

export default TextField.extend(EKOnFocusMixin, {
  _performSearchOnKey: on(keyDown('Enter'), function() {
    this.attrs.performSearch();
  }),

  _cancel: on(keyDown('Escape'), function() {
    this.attrs.cancel();
  }),

  _navDown: on(keyDown('ArrowDown'), function(event) {
    event.preventDefault();
    this.attrs.navDown();
  }),

  _navUp: on(keyDown('ArrowUp'), function(event) {
    event.preventDefault();
    this.attrs.navUp();
  }),

  keyUp(...args) {
    this._super(...args);

    this.get('_searchCurrentValue').perform();
  },

  mouseUp(...args) {
    this._super(...args);

    this.get('_searchCurrentValue').perform();
  },

  touchEnd(...args) {
    this._super(...args);

    this.get('_searchCurrentValue').perform();
  },

  _searchCurrentValue: task(function * () {
    const index = this.element.selectionStart;
    const value = this.element.value;
    const startOfWordIndex = value.slice(0, index).search(/[\s](?=[^\s]*$)/) + 1;
    let length = value.slice(index).search(/[\s]/);
    length = length === -1 ? undefined : length + index - startOfWordIndex;
    const endOfWordIndex = length ? startOfWordIndex + length : this.element.value.length;

    new Promise((resolve) => {
      this.attrs.lookupAutocomplete(value.slice(startOfWordIndex, length), index, resolve);
    }).then((word) => {
      this.element.value = `${this.element.value.slice(0, startOfWordIndex)}${word}${this.element.value.slice(endOfWordIndex)}`;
      this.element.focus();
      this.element.selectionStart = startOfWordIndex + word.length;
      this.element.selectionEnd = this.element.selectionStart;
    });
  }).restartable(),

  actions: {
    search() {
      this.attrs.performSearch();
    }
  }
});
