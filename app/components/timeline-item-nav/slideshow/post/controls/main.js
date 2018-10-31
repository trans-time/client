import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import { EKMixin, EKOnInsertMixin, keyUp } from 'ember-keyboard';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';

export default Component.extend(AuthenticatedActionMixin, EKMixin, EKOnInsertMixin, {
  tagName: '',
  currentUser: service(),
  modalManager: service(),
  store: service(),
  currentUserReaction: alias('timelineItem.currentUserReaction'),

  _keyToggleShare: on(keyUp('KeyX'), function() {
    if (this.get('isCurrentTimelineItem')) {
      const fullShare = this.get('fullShare');
      this.get('modalManager').open('share-modal', () => {}, () => {}, { fullShare, timelineItemId: this.get('timelineItem.id') });
    }
  }),

  _keyToggleChat: on(keyUp('KeyC'), function() {
    if (this.get('isCurrentTimelineItem')) this.attrs.toggleChat();
  }),

  _createNewReaction(reactionType, user, reactable) {
    this.set('reactionDisabled', true);
    const reaction = this.get('store').createRecord('reaction', {
      user,
      reactable,
      reactionType
    });

    reaction.save().then((reaction) => {
      reactable.set('currentUserReaction', reaction);
      reactable.incrementProperty(`${reactionType}Count`);
      reactable.incrementProperty('reactionCount');
    }).finally(() => {
      this.setProperties({
        reactionDisabled: false
      });
    });
  },

  _destroyReaction(reactable) {
    const currentUserReaction = this.get('currentUserReaction');
    const previousType = currentUserReaction.get('reactionType');

    this.set('reactionDisabled', true);
    currentUserReaction.destroyRecord().then(() => {
      reactable.set('currentUserReaction', undefined);
      reactable.decrementProperty(`${previousType}Count`);
      reactable.decrementProperty('reactionCount');
    }).finally(() => {
      this.set('reactionDisabled', false);
    });
  },

  actions: {
    openShare() {
      this._keyToggleShare();
    },

    toggleChat() {
      this._keyToggleChat();
    },

    toggleReaction() {
      this.authenticatedAction().then(() => {
        if (!this.get('reactionDisabled')) {
          if (this.currentUserReaction) {
            this._destroyReaction(this.timelineItem);
          } else {
            this._createNewReaction('moon', this.currentUser.user, this.timelineItem);
          }
        }
      })
    }
  }
});
