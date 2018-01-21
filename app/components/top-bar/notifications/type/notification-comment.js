import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  otherComments: computed({
    get() {
      return this.get('notification.totalComments') - 1;
    }
  })
});
