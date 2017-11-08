import { Promise as EmberPromise } from 'rsvp';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  modalManager: service(),
  session: service(),

  authenticatedAction() {
    return new EmberPromise((resolve, reject) => {
      if (this.get('session.isAuthenticated')) {
        resolve();
      } else {
        this.get('modalManager').open('auth-modal/login', resolve, reject);
      }
    });
  }
});
