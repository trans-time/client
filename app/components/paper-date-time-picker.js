import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: 'paper-date-time-picker',
  format: 'MM/DD/YYYY',
  yearRange: computed({
    get() {
      const year = (new Date()).getFullYear();
      return `${year - 100}, ${year}`;
    }
  })
});
