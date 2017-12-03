import { resolve } from 'rsvp';
import { isEmpty } from '@ember/utils';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
  messageBus: service(),
  modalManager: service(),
  session: service(),
  store: service(),

  load() {
    const userId = this.get('session.data.authenticated.id');

    if (!isEmpty(userId)) {
      const store = this.get('store');

      return store.findRecord('user', userId).then((user) => {
        this.set('user', user);

        this.get('modalManager').close('resolve');

        store.findRecord('current-user', userId).then((currentUser) => {
          user.set('currentUser', currentUser);
        });

        store.query('follow', { followerId: user.id }).then(() => this.get('messageBus').publish('currentUserFollowsAreLoaded'));
      });
    } else {
      return resolve();
    }
  }
});
