import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['identities-form-identity'],

  intl: service(),
  moment: service(),

  endDate: computed('userIdentity.endDate', {
    get() {
      const endDate = this.get('userIdentity.endDate');

      return isPresent(endDate) ? this._morphMoment(this.get('moment').moment(endDate)).format('MM/DD/YYYY') : this.get('intl').t('identities.present');
    }
  }),

  startDate: computed('userIdentity.startDate', {
    get() {
      const startDate = this.get('userIdentity.startDate');

      return isPresent(startDate) ? this._morphMoment(this.get('moment').moment(startDate)).format('MM/DD/YYYY') : this.get('intl').t('identities.birth');
    }
  }),

  _morphMoment(time) {
    const momentService = this.get('moment');
    const locale = momentService.get('locale');
    const timeZone = momentService.get('timeZone');

    if (locale && time.locale) {
      time = time.locale(locale);
    }

    if (timeZone && time.tz) {
      time = time.tz(timeZone);
    }

    return time;
  },

  endDateId: computed({
    get() {
      return `${guidFor(this)}_end_date`;
    }
  }),

  startDateId: computed({
    get() {
      return `${guidFor(this)}_start_date`;
    }
  }),

  actions: {
    expand() {
      this.toggleProperty('expanded');
    },

    removeUserIdentity() {
      this.attrs.removeUserIdentity();
    }
  }
});
