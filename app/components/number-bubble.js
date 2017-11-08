import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['number-bubble'],

  formattedNumber: computed('number', {
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
