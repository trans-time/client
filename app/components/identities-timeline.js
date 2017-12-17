import EmberObject, { computed } from '@ember/object';
import { isNone } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  userIdentityGroups: computed({
    get() {
      const userIdentities = this.get('userIdentities').sortBy('identity.name');
      const groups = userIdentities.reduce((groups, userIdenity) => {
        const name = userIdenity.get('identity.name');

        if (isNone(groups.get(name))) groups.set(name, Ember.A());

        groups.get(name).pushObject(userIdenity);

        return groups;
      }, EmberObject.create());

      Object.keys(groups).forEach((key) => {
        groups.get(key).sort((a, b) => {
          return a.get('endDate') - b.get('endDate');
        });
      });

      return groups;
    }
  }),

  earliestDate: computed({
    get() {
      return this._determineDateBracket(Math.min);
    }
  }),

  latestDate: computed({
    get() {
      return this._determineDateBracket(Math.max);
    }
  }),

  _determineDateBracket(minOrMax) {
    const groups = this.get('userIdentityGroups');

    return Object.keys(groups).reduce((overallDate, key) => {
      return groups.get(key).reduce((groupDate, userIdentity) => {
        const { endDate, startDate } = userIdentity.getProperties('endDate', 'startDate');
        const date = isNone(endDate) ? startDate : isNone(startDate) ? endDate : minOrMax(endDate, startDate);
        return isNone(groupDate) ? date : isNone(date) ? groupDate : minOrMax(date, groupDate);
      }, overallDate);
    }, null);
  }
});
