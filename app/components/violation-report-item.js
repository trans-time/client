import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['violation-report-item'],
  tagName: 'li',

  intl: service(),

  violations: computed({
    get() {
      const intl = this.get('intl');
      const flags = this.get('report.flags');

      return flags.reduce((accumulator, flag) => {
        ['bigotry', 'bot', 'harassment', 'sleaze', 'threat', 'unconsentingImage', 'unmarkedNSFW'].forEach((violation) => {
          if (flag.get(violation)) accumulator.incrementProperty(intl.t(`flags.attributes.${violation}.name`));
        });

        return accumulator;
      }, EmberObject.create());
    }
  }),

  additionalComments: computed({
    get() {
      return this.get('report.flags').map((flag) => flag.get('text'));
    }
  })
});
