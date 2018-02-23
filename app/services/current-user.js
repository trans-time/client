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

      return store.findRecord('user', username, { include: 'followeds,blockeds,blockers' }).then((user) => {
        this.set('user', user);

        this.get('messageBus').publish('currentUserLoaded');

        this.get('modalManager').close('resolve');

        store.findRecord('current-user', user.id).then((currentUser) => {
          user.set('currentUser', currentUser);
        });
      });
    } else {
      return resolve();
    }
  }
});
