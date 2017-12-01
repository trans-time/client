import { resolve } from 'rsvp';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
  session: service(),
  store: service(),

  load() {
    const userId = this.get('session.data.authenticated.id');

    if (!isEmpty(userId)) {
      const store = this.get('store');

      return store.findRecord('user', userId).then((user) => {
        this.set('user', user);

        store.findRecord('current-user', userId).then((currentUser) => {
          user.set('currentUser', currentUser);
        });

        store.query('follow', { followerId: user.id });
      });
    } else {
      return resolve();
    }
  }
});
