import Mixin from '@ember/object/mixin';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { typeOf } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';

export default Mixin.create({
  classNames: ['notification-link'],
  classNameBindings: ['notificationLinkUnread'],
  tagName: 'a',

  router: service(),

  notificationLinkUnread: not('notification.read'),

  click(...args) {
    this._super(...args);

    this.get('_visit').perform();
  },

  touchEnd(...args) {
    this._super(...args);

    this.get('_visit').perform();
  },

  _visit: task(function * () {
    yield timeout(10);

    if (typeOf(this.attrs.toggleNotifications) === 'function') this.attrs.toggleNotifications();

    const notification = this.get('notification');

    if (!notification.get('read')) {
      notification.set('read', true);

      notification.save();
    }

    this.transitionToNotification();
  }).drop()
});
