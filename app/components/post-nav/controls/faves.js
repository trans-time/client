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
        this._changeFavType(type);
      } else {
        this._createNewFav(type, user, post);
      }
    } else {
      if (this.get('faved')) {
        this._destroyFav();
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
    }).finally(() => {
      this.setProperties({
        disabled: false,
        shouldDisplayAllTypes: false
      });
    });
  },

  _changeFavType(newType) {
    const currentUserFav = this.get('currentUserFav');
    const previousType = currentUserFav.get('type');

    if (previousType !== newType) {
      currentUserFav.set('type', newType);
      this.set('disabled', true);
      currentUserFav.save().catch(() => {
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

  _destroyFav() {
    this.set('disabled', true);
    this.get('currentUserFav').destroyRecord().then(() => {
      this.set('post.currentUserFav', null);
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
        this._handleSelection(type);
      }).catch(() => {
        this.setProperties({
          currentType: type,
          shouldDisplayAllTypes: false
        });
      });
    }
  }
});
