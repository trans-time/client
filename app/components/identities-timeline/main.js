import EmberObject, { computed } from '@ember/object';
import { isNone } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['identities-timeline-main'],

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
  })
});
