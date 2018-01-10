import TextField from '@ember/component/text-field';
import { on } from '@ember/object/evented';
import { task } from 'ember-concurrency';
import { EKOnFocusMixin, keyDown } from 'ember-keyboard';
import { Promise } from 'rsvp';

export default TextField.extend(EKOnFocusMixin, {
  _performSearchOnKey: on(keyDown('Enter'), function() {
    this.attrs.performSearch();
  }),

  _navDown: on(keyDown('ArrowDown'), function() {
    this.attrs.navDown();
  }),

  _navUp: on(keyDown('ArrowUp'), function() {
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

    new Promise((resolve) => {
      this.attrs.lookupAutocomplete(value.slice(startOfWordIndex, length), resolve);
    }).then((word) => {
      this.element.value = `${this.element.value.slice(0, startOfWordIndex)}${word}${this.element.value.slice(length ? startOfWordIndex + length : this.element.value.length)}`;
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
