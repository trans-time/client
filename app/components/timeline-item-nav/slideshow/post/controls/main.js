import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import { EKMixin, EKOnInsertMixin, keyUp } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  tagName: '',
  currentUser: service(),
  modalManager: service(),
  store: service(),

  _keyToggleShare: on(keyUp('KeyX'), function() {
    if (this.get('isCurrentTimelineItem')) this._share();
  }),

  _keyToggleChat: on(keyUp('KeyC'), function() {
    if (this.get('isCurrentTimelineItem')) this._chat();
  }),

  _share() {
    const fullShare = this.get('fullShare');
    this.get('modalManager').open('share-modal', () => {}, () => {}, { fullShare, timelineItemId: this.get('timelineItem.id') });
  },

  _chat() {
    this.attrs.toggleChat();
  },

  actions: {
    openShare() {
      this._share();
    },

    toggleChat() {
      this._chat();
    }
  }
});
