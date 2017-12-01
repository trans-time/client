import { capitalize } from '@ember/string';
import { computed } from '@ember/object';
import { oneWay, alias, notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';

export default Component.extend(AuthenticatedActionMixin, {
  tagName: '',

  disabled: false,
  types: ['moon', 'star', 'sun'],

  currentUser: service(),
  store: service(),

  user: oneWay('currentUser.user'),

  currentUserFav: alias('post.currentUserFav.content'),
  faved: notEmpty('currentUserFav'),
  selectedCurrentType: oneWay('currentUserFav.type'),

  currentType: computed('selectedCurrentType', {
    get() {
      return this.get('selectedCurrentType') || 'star';
    }
  }),

  _handleSelection(type) {
    const { post, user }= this.getProperties('post', 'user');

    if (this.get('shouldDisplayAllTypes')) {
      if (this.get('faved')) {
        this._changeFavType(type, post);
      } else {
        this._createNewFav(type, user, post);
      }
    } else {
      if (this.get('faved')) {
        this._destroyFav(post);
      } else {
        this._createNewFav(type, user, post);
      }
    }
  },

  _createNewFav(type, user, post) {
    this.set('disabled', true);
    this.get('store').createRecord('fav', {
      user,
      post,
      type
    }).save().then((fav) => {
      post.set('currentUserFav', fav);
      post.incrementProperty('totalFaves');
      post.incrementProperty(`total${capitalize(type)}s`);
    }).finally(() => {
      this.setProperties({
        disabled: false,
        shouldDisplayAllTypes: false
      });
    });
  },

  _changeFavType(newType, post) {
    const currentUserFav = this.get('currentUserFav');
    const previousType = currentUserFav.get('type');

    if (previousType !== newType) {
      currentUserFav.set('type', newType);
      this.set('disabled', true);
      currentUserFav.save().then(() => {
        post.decrementProperty(`total${capitalize(previousType)}s`);
        post.incrementProperty(`total${capitalize(newType)}s`);
      }).catch(() => {
        currentUserFav.set('type', previousType);
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

  _destroyFav(post) {
    const currentUserFav = this.get('currentUserFav');
    const previousType = currentUserFav.get('type');

    this.set('disabled', true);
    currentUserFav.destroyRecord().then(() => {
      this.set('post.currentUserFav', null);
      post.decrementProperty('totalFaves');
      post.decrementProperty(`total${capitalize(previousType)}s`);
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
      this.authenticatedAction().then(() => {
        if (!this.get('disabled')) this._handleSelection(type);
      }).catch(() => {
        this.setProperties({
          currentType: type,
          shouldDisplayAllTypes: false
        });
      });
    }
  }
});
