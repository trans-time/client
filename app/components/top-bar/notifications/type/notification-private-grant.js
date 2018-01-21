import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  otherGrants: computed({
    get() {
      return this.get('notification.totalGrants') - 1;
    }
  })
});
