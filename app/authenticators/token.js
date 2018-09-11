import BasicAuthenticator from './basic';
import { later, run } from '@ember/runloop';

export default BasicAuthenticator.extend({
  authenticate(data) {
    const { resourceName, tokenAttributeName, identificationAttributeName } = this.getProperties('resourceName', 'tokenAttributeName', 'identificationAttributeName');
console.log(data)
    return new Promise((resolve, reject) => {
      if (this._validate(data)) {
        const resourceName = this.get('resourceName');
        const _json = data[resourceName] ? data[resourceName] : data;
        run(null, resolve, _json);
        later(() => {
          this.get('messageBus').publish('userWasAuthenticated');
        }, 100);
      } else {
        run(null, reject, `Check that server response includes ${tokenAttributeName} and ${identificationAttributeName}`);
      }
    });
  }
});
