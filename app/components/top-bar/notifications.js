import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['top-bar-notifications'],
  tagName: 'ul',

  currentUser: service(),
  store: service(),

  notifications: computed({
    get() {
      return this.get('store').query('notification', { userId: this.get('currentUser.user.id'), perPage: 7, startingPage: 1 });
    }
  })
});
