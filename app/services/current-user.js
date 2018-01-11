import { resolve } from 'rsvp';
import { isEmpty } from '@ember/utils';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
  messageBus: service(),
  modalManager: service(),
  session: service(),
  store: service(),

  load() {
    const username = this.get('session.data.authenticated.username');

    if (!isEmpty(username)) {
      const store = this.get('store');

      return store.queryRecord('user', { username, include: 'followeds, blockeds' }).then((user) => {
        this.set('user', user);

        this.get('modalManager').close('resolve');

        store.findRecord('current-user', user.id).then((currentUser) => {
          user.set('currentUser', currentUser);
        });

        store.query('follow', { followerId: user.id }).then(() => this.get('messageBus').publish('currentUserFollowsAreLoaded'));
      });
    } else {
      return resolve();
    }
  }
});
