import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  otherTags: computed({
    get() {
      return this.get('notification.totalTags') - 1;
    }
  })
});
