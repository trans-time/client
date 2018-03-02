import Service, { inject as service } from '@ember/service';
import { Promise } from 'rsvp';

export default Service.extend({
  paperToaster: service(),

  wrapResponse(promise) {
    return new Promise((resolve, reject) => {
      promise.then(resolve).catch(({ errors }) => {
        this.get('paperToaster').showComponent('paper-toaster-error', {
          errors,
          toastClass: 'paper-toaster-error-container'
        });
        reject();
      });
    });
  }
});
