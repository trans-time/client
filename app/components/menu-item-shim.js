import Component from '@ember/component';

export default Component.extend({
  tagName: 'md-menu-item',

  mouseEnter() {
    this.$('button').focus();
  },

  actions: {
    handleClick(event) {
      this.sendAction('onClick', event);
    }
  }
});
