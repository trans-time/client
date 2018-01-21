import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  otherRequests: computed({
    get() {
      return this.get('notification.totalRequests') - 1;
    }
  })
});
