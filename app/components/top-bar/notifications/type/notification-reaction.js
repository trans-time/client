import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  otherReactions: computed({
    get() {
      return this.get('notification.totalReactions') - 1;
    }
  })
});
