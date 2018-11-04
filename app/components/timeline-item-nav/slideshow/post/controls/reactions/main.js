import { computed } from '@ember/object';
import { oneWay, alias, notEmpty } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';
import { task, timeout } from 'ember-concurrency';
import { EKMixin, keyDown, keyUp } from 'ember-keyboard';

export default Component.extend(AuthenticatedActionMixin, EKMixin, {
  tagName: '',

  disabled: false,

  currentUser: service(),
  router: service(),
  store: service(),

  user: oneWay('currentUser.user'),

  currentUserReaction: alias('reactable.currentUserReaction'),
  reacted: notEmpty('currentUserReaction'),

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
    toggleReaction() {
      this.authenticatedAction().then(() => {
        if (!this.get('reactionDisabled')) {
          if (this.currentUserReaction) {
            this._destroyReaction(this.reactable);
          } else {
            this._createNewReaction('moon', this.currentUser.user, this.reactable);
          }
        }
      })
    }
  }
});
