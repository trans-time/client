import { resolve } from 'rsvp';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
  session: service(),
  store: service(),

  configuration: alias('user.userConfiguration'),

  load() {
    const userId = this.get('session.data.authenticated.id');
console.log('load', userId)
    if (!isEmpty(userId)) {
      const store = this.get('store');

      return store.findRecord('user', userId).then((user) => {
        this.set('user', user);

        store.findRecord('user-configuration', userId).then((userConfiguration) => {
          user.set('userConfiguration', userConfiguration);
        });
      });
    } else {
      return resolve();
    }
  }
});
