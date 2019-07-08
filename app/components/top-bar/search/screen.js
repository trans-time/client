import Component from '@ember/component';
import { on } from '@ember/object/evented';

export default Component.extend({
  classNames: ['search-bar-results-screen'],

  click(event) {
    event.preventDefault();
    event.stopPropagation();
    this.attrs.cancel();
  },

  touchEnd(event) {
    event.preventDefault();
    event.stopPropagation();
    this.attrs.cancel();
  }
});
