import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['timeline-item-nav-controls-main'],
  modalManager: service(),

  actions: {
    openShare() {
      const fullShare = this.get('fullShare');
      this.get('modalManager').open('share-modal', () => {}, () => {}, { fullShare, timelineItemId: this.get('timelineItem.id') });
    },

    toggleChat() {
      this.attrs.toggleChat();
    }
  }
});
