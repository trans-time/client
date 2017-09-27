import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  types: ['moon', 'star', 'sun'],
  currentType: 'star',

  modalManager: Ember.inject.service(),
  session: Ember.inject.service(),

  _handleSelection(type) {
    if (this.get('shouldDisplayAllTypes')) {
      this.setProperties({
        currentType: type,
        faved: true,
        shouldDisplayAllTypes: false
      });
    } else {
      this.toggleProperty('faved');
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
      if (this.get('session.isAuthenticated')) {
        this._handleSelection(type);
      } else {
        const promise = new Ember.RSVP.Promise((resolve, reject) => {
          this.get('modalManager').open('auth-modal/login', resolve, reject);
        });

        promise.then(() => {
          this._handleSelection(type);
        }).catch(() => {
          this.setProperties({
            currentType: type,
            shouldDisplayAllTypes: false
          });
        });
      }
    }
  }
});
