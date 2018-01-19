import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: 'notification',
  tagName: 'li',

  notificationType: computed({
    get() {
      return `top-bar/notifications/type/${this.get('notification.constructor.modelName')}`;
    }
  })
});
