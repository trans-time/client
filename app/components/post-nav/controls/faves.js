import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  types: ['moon', 'star', 'sun'],
  currentType: 'star',

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
      if (this.get('shouldDisplayAllTypes')) {
        this.setProperties({
          currentType: type,
          faved: true,
          shouldDisplayAllTypes: false
        });
      } else {
        this.toggleProperty('faved');
      }
    }
  }
});
