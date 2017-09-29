import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['number-bubble'],

  formattedNumber: Ember.computed('number', {
    get() {
      const number = this.get('number');

      if (number < 1000) {
        return number;
      } else if (number < 10000) {
        return `${(number / 1000).toFixed(1)}K`
      } else if (number < 1000000) {
        return `${(number / 1000).toFixed(0)}K`
      } else {
        return `${(number / 1000000).toFixed(0)}M`
      }
    }
  })
});
