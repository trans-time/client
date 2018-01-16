import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['flag-item'],
  tagName: 'li',

  intl: service(),

  violations: computed({
    get() {
      const { flag, intl } = this.getProperties('flag', 'intl');

      return ['bigotry', 'bot', 'harassment', 'sleaze', 'threat', 'unconsentingImage', 'unmarkedNSFW'].reduce((accumulator, violation) => {
        if (flag.get(violation)) accumulator.push(intl.t(`flags.attributes.${violation}.name`));

        return accumulator;
      }, []);
    }
  })
});
