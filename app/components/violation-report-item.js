import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['violation-report-item'],
  tagName: 'li',

  additionalComments: computed({
    get() {
      return this.get('report.flags').map((flag) => flag.get('text'));
    }
  })
});
