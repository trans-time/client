import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { EKMixin, EKOnFocusMixin, EKFirstResponderOnFocusMixin, keyUp } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnFocusMixin, EKFirstResponderOnFocusMixin, {
  attributeBindings: ['tabindex'],
  classNames: ['taggable-textarea-option'],
  tagName: 'li',

  tabindex: 0,

  click(...args) {
    this._super(...args);

    this.attrs.choose();
  },

  touchEnd(...args) {
    this._super(...args);

    this.attrs.choose();
  },

  _cancel: on(keyUp('Escape'), function() {
    this.attrs.cancel();
  }),

  _choose: on(keyUp('Enter'), function() {
    this.attrs.choose();
  }),

  _navDown: on(keyUp('ArrowDown'), function() {
    this.attrs.navDown();
  }),

  _navUp: on(keyUp('ArrowUp'), function() {
    this.attrs.navUp();
  })
});
