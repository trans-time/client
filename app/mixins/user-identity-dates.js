import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
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
  }
});
