import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { EKMixin, EKOnFocusMixin, keyDown } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnFocusMixin, {
  attributeBindings: ['tabindex'],
  classNames: ['search-bar-results-group-item'],
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

  _cancel: on(keyDown('Escape'), function() {
    this.attrs.cancel();
  }),

  _choose: on(keyDown('Enter'), function() {
    this.attrs.choose();
  }),

  _navDown: on(keyDown('ArrowDown'), function(event) {
    event.preventDefault();
    this.attrs.navDown();
  }),

  _navUp: on(keyDown('ArrowUp'), function(event) {
    event.preventDefault();
    this.attrs.navUp();
  })
});
