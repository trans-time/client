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
  types: ['moon', 'star', 'sun'],

  currentUser: service(),
  router: service(),
  store: service(),

  user: oneWay('currentUser.user'),

  currentUserReaction: alias('reactable.currentUserReaction'),
  reacted: notEmpty('currentUserReaction'),
  selectedCurrentType: oneWay('currentUserReaction.reactionType'),
  keyboardActivated: alias('isCurrentTimelineItem'),

  _startReactionKeyAction: on(keyDown('KeyZ'), function() {
    if (this.get('shouldDisplayAllTypes')) this.set('_startClosingReactionKey', true);
    else this.get('_reactionKeyStartTask').perform();
  }),

  _endReactionKeyAction: on(keyUp('KeyZ'), function() {
    if (!this.get('shouldDisplayAllTypes')) {
      this.set('_reactionKeyStarted', false);
      this._selectType(this.get('currentType'));
    } else if (this.get('_startClosingReactionKey2')) {
      this.setProperties({
        shouldDisplayAllTypes: false,
        _startClosingReactionKey: false,
        _startClosingReactionKey2: false
      });
    } else if (this.get('_startClosingReactionKey')) {
      this.set('_startClosingReactionKey2', true);
    }
  }),

  _reactionKeyStartTask: task(function * () {
    this.setProperties({
      _reactionKeyStarted: true,
      _startClosingReactionKey: false,
      _startClosingReactionKey2: false
    });

    yield timeout(300);

    if (this.get('_reactionKeyStarted')) this.set('shouldDisplayAllTypes', true);
  }).drop(),

  currentType: computed('selectedCurrentType', {
    get() {
      return this.get('selectedCurrentType') || 'star';
    }
  }),

  currentReactionId: computed({
    get() {
      return `${guidFor(this)}_current_reaction`;
    }
  }),

  currentReactionIdHash: computed('currentReactionId', {
    get() {
      return `#${this.get('currentReactionId')}`
    }
  }),

  tetherAttachment: computed({
    get() {
      const type = this.get('reactable').constructor.modelName;

      return type === 'comment' ? 'middle middle' : 'middle left';
    }
  }),

  _selectType(type) {
    this.authenticatedAction().then(() => {
      if (!this.get('disabled')) this._handleSelection(type);
    }).catch(() => {
      this.setProperties({
        currentType: type,
        shouldDisplayAllTypes: false
      });
    });
  },

  _handleSelection(type) {
    const { reactable, user }= this.getProperties('reactable', 'user');

    if (this.get('shouldDisplayAllTypes')) {
      if (this.get('reacted')) {
        this._changeReactionType(type, reactable);
      } else {
        this._createNewReaction(type, user, reactable);
      }
    } else {
      if (this.get('reacted')) {
        if (type === this.get('currentType')) {
          this._destroyReaction(reactable);
        } else {
          this._changeReactionType(type, reactable);
        }
      } else {
        this._createNewReaction(type, user, reactable);
      }
    }
  },

  _createNewReaction(reactionType, user, reactable) {
    this.set('disabled', true);
    const reaction = this.get('store').createRecord('reaction', {
      user,
      reactable,
      reactionType
    });

    reaction.save().then((reaction) => {
      reactable.set('currentUserReaction', reaction);
      reactable.incrementProperty(`${reactionType}Count`);
    }).finally(() => {
      this.setProperties({
        disabled: false,
        shouldDisplayAllTypes: false
      });
    });
  },

  _changeReactionType(newType, reactable) {
    const currentUserReaction = this.get('currentUserReaction');
    const previousType = currentUserReaction.get('reactionType');

    if (previousType !== newType) {
      currentUserReaction.set('reactionType', newType);
      this.set('disabled', true);

      currentUserReaction.save().then(() => {
        reactable.decrementProperty(`${previousType}Count`);
        reactable.incrementProperty(`${newType}Count`);
      }).catch(() => {
        currentUserReaction.set('reactionType', previousType);
      }).finally(() => {
        this.setProperties({
          disabled: false,
          shouldDisplayAllTypes: false
        });
      });
    } else {
      this.set('shouldDisplayAllTypes', false);
    }
  },

  _destroyReaction(reactable) {
    const currentUserReaction = this.get('currentUserReaction');
    const previousType = currentUserReaction.get('reactionType');

    this.set('disabled', true);
    currentUserReaction.destroyRecord().then(() => {
      reactable.set('currentUserReaction', undefined);
      reactable.decrementProperty(`${previousType}Count`);
    }).finally(() => {
      this.set('disabled', false);
    });
  },

  actions: {
    completeDisplayAllTypes() {
      this.set('isOpeningDisplayAllTypes', false);
    },

    displayAllTypes() {
      this.setProperties({
        isOpeningDisplayAllTypes: true,
        shouldDisplayAllTypes: true,
      });
    },

    selectType(type) {
      this._selectType(type);
    },

    viewAllReactions() {
      const reactable = this.get('reactable');
      const type = reactable.constructor.modelName;

      this.get('router').transitionTo(`${type}s.${type}.reactions`, reactable);
    }
  }
});
