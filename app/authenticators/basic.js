import { getOwner } from '@ember/application';
import { merge, assign as emberAssign } from '@ember/polyfills';
import { deprecatingAlias } from '@ember/object/computed';
import { run, later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import fetch from 'fetch';
import { Promise } from 'rsvp';
import config from 'client/config/environment';

const assign = emberAssign || merge;

const JSON_CONTENT_TYPE = 'application/vnd.api+json';

export default BaseAuthenticator.extend({
  serverTokenEndpoint: '/v1/auth/identity/callback',
  resourceName: 'user',
  tokenAttributeName: 'token',
  identificationAttributeName: 'username',

  messageBus: service(),
  paperToaster: service(),

  rejectWithXhr: deprecatingAlias('rejectWithResponse', {
    id: `ember-simple-auth.authenticator.reject-with-xhr`,
    until: '2.0.0'
  }),

  rejectWithResponse: false,

  restore(data) {
    if (this._validate(data)) {
      return Promise.resolve(data);
    } else {
      return Promise.reject();
    }
  },

  authenticate(identification, password) {
    return new Promise((resolve, reject) => {
      const useResponse = this.get('rejectWithResponse');
      const { resourceName, identificationAttributeName, tokenAttributeName } = this.getProperties('resourceName', 'identificationAttributeName', 'tokenAttributeName');
      const data = { data: { attributes: { password, identification } } };

      this.makeRequest(data).then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            if (this._validate(json)) {
              const resourceName = this.get('resourceName');
              const _json = json[resourceName] ? json[resourceName] : json;
              run(null, resolve, _json);
              later(() => {
                this.get('messageBus').publish('userWasAuthenticated');
              }, 100);
            } else {
              run(null, reject, `Check that server response includes ${tokenAttributeName} and ${identificationAttributeName}`);
            }
          });
        } else {
          if (useResponse) {
            run(null, reject, response);
          } else {
            response.json().then((json) => {
              Ember.getOwner(this).lookup('adapter:application').handleResponse(response.status, response.headers, json, {});
              run(null, reject, json);
            });
          }
        }
      }).catch((error) => run(null, reject, error));
    });
  },

  invalidate() {
    return Promise.resolve();
  },

  makeRequest(data, options = {}) {
    let url = options.url || this.get('serverTokenEndpoint');
    let requestOptions = {};
    let body = JSON.stringify(data);
    assign(requestOptions, {
      body,
      method:   'POST',
      headers:  {
        'accept':       JSON_CONTENT_TYPE,
        'content-type': JSON_CONTENT_TYPE
      }
    });
    assign(requestOptions, options || {});

    return fetch(`${config.host}${url}`, requestOptions);
  },

  _validate(data) {
    const tokenAttributeName = this.get('tokenAttributeName');
    const identificationAttributeName = this.get('identificationAttributeName');
    const resourceName = this.get('resourceName');
    const _data = data[resourceName] ? data[resourceName] : data;

    return !isEmpty(_data[tokenAttributeName]) && !isEmpty(_data[identificationAttributeName]);
  }
});
