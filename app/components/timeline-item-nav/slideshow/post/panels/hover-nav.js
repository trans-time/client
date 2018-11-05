import Component from '@ember/component';

export default Component.extend({
  classNames: 'hover-nav',

  click() {
    this.scroll(this.direction);
  }
});
