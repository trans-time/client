import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  intl: service(),

  hasViolations: computed({
    get() {
      return Object.keys(this.get('violations')).length > 0;
    }
  }),

  violations: computed({
    get() {
      const intl = this.get('intl');
      const flags = this.get('report.flags');

      return flags.reduce((accumulator, flag) => {
        ['bot', 'illicitActivity', 'trolling', 'unconsentingImage', 'incorrectContentWarning'].forEach((violation) => {
          if (flag.get(violation)) accumulator.incrementProperty(intl.t(`flags.attributes.${violation}.name`));
        });

        return accumulator;
      }, EmberObject.create());
    }
  })
});
