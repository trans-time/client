import Ember from 'ember';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';

export default Ember.Component.extend(AuthenticatedActionMixin, {
  tagName: '',
  types: ['moon', 'star', 'sun'],

  currentUser: Ember.inject.service(),
  store: Ember.inject.service(),

  faves: Ember.computed.alias('post.faves'),
  user: Ember.computed.oneWay('currentUser.user'),

  faved: Ember.computed.notEmpty('userFav'),
  selectedCurrentType: Ember.computed.oneWay('userFav.type'),

  currentType: Ember.computed('selectedCurrentType', {
    get() {
      return this.get('selectedCurrentType') || 'star';
    }
  }),

  userFav: Ember.computed('faves.@each.user', 'user', {
    get() {
      return this.get('faves').findBy('user.id', this.get('user.id'));
    }
  }),

  _handleSelection(type) {
    const user = this.get('user');

    if (this.get('shouldDisplayAllTypes')) {
      if (this.get('faved')) {
        const userFav = this.get('userFav');
        if (userFav.get('type') !== type) {
          userFav.set('type', type);
          userFav.save();
        }
      } else {
        this.get('store').createRecord('fav', {
          user,
          post: this.get('post'),
          type
        }).save();
      }

      this.set('shouldDisplayAllTypes', false);
    } else {
      if (this.get('faved')) {
        this.get('userFav').destroyRecord();
      } else {
        this.get('store').createRecord('fav', {
          user,
          post: this.get('post'),
          type
        }).save();
      }
    }
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
