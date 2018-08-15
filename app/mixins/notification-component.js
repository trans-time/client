import Mixin from '@ember/object/mixin';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { typeOf } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';

export default Mixin.create({
  classNames: ['notification-link'],
  classNameBindings: ['notificationLinkUnread'],
  tagName: 'span',

  router: service(),

  notificationLinkUnread: not('notification.isRead'),

  actions: {
    handleClick() {
      const notification = this.get('notification');

      if (!notification.get('isRead')) {
        notification.set('isRead', true);

        notification.save();
      }

      this.transitionToNotification();
    }
  }
});
