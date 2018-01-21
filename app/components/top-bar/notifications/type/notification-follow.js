import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  otherFollows: computed({
    get() {
      return this.get('notification.totalFollows') - 1;
    }
  })
});
