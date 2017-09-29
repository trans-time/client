import Ember from 'ember';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';

export default Ember.Component.extend(AuthenticatedActionMixin, {
  tagName: '',

  disabled: false,
  types: ['moon', 'star', 'sun'],

  currentUser: Ember.inject.service(),
  store: Ember.inject.service(),

  user: Ember.computed.oneWay('currentUser.user'),

  currentUserFav: Ember.computed.alias('post.currentUserFav.content'),
  faved: Ember.computed.notEmpty('currentUserFav'),
  selectedCurrentType: Ember.computed.oneWay('currentUserFav.type'),

  currentType: Ember.computed('selectedCurrentType', {
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
      post.incrementProperty(`total${Ember.String.capitalize(type)}s`);
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
        post.decrementProperty(`total${Ember.String.capitalize(previousType)}s`);
        post.incrementProperty(`total${Ember.String.capitalize(newType)}s`);
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
      post.decrementProperty(`total${Ember.String.capitalize(previousType)}s`);
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
