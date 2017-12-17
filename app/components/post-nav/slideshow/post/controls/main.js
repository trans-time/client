import Component from '@ember/component';

export default Component.extend({
  classNames: ['post-nav-controls-main'],

  actions: {
    toggleChat() {
      this.attrs.toggleChat();
    }
  }
});
