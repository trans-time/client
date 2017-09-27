import Ember from 'ember';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';

export default Ember.Component.extend(AuthenticatedActionMixin, {
  tagName: '',
  types: ['moon', 'star', 'sun'],
  currentType: 'star',

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
