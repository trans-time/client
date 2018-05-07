import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  intl: service(),

  hasViolations: computed({
    get() {
      return this.get('violations.length') > 0;
    }
  }),

  violations: computed({
    get() {
      const { flag, intl } = this.getProperties('flag', 'intl');

      return ['bot', 'illicitActivity', 'trolling', 'unconsentingImage', 'incorrectMaturityRating'].reduce((accumulator, violation) => {
        if (flag.get(violation)) accumulator.push(intl.t(`flags.attributes.${violation}.name`));

        return accumulator;
      }, []);
    }
  })
});
