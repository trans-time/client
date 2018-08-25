import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import { EKMixin, EKOnInsertMixin, keyUp } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  tagName: '',
  modalManager: service(),

  _keyToggleShare: on(keyUp('KeyX'), function() {
    if (this.get('isCurrentTimelineItem')) {
      const fullShare = this.get('fullShare');
      this.get('modalManager').open('share-modal', () => {}, () => {}, { fullShare, timelineItemId: this.get('timelineItem.id') });
    }
  }),

  _keyToggleChat: on(keyUp('KeyC'), function() {
    if (this.get('isCurrentTimelineItem')) this.attrs.toggleChat();
  }),

  actions: {
    openShare() {
      this._keyToggleShare();
    },

    toggleChat() {
      this._keyToggleChat();
    }
  }
});
