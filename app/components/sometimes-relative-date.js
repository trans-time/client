import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  moment: service(),

  showRelativeDate: computed('date', {
    get() {
      const moment = this.get('moment');
      const now = moment.moment(Date.now());
      const date = moment.moment(this.get('date'));

      return date.isAfter(now.subtract(1, 'month'));
    }
  })
});
