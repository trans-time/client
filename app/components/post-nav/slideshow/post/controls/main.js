import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['post-nav-controls-main'],
  modalManager: service(),

  actions: {
    openShare() {
      const fullShare = this.get('fullShare');
      this.get('modalManager').open('share-modal', () => {}, () => {}, { fullShare, postId: this.get('post.id') });
    },

    toggleChat() {
      this.attrs.toggleChat();
    }
  }
});
