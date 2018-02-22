import { deprecatingAlias } from '@ember/object/computed';
import { Promise } from 'rsvp';
import { inject } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { run, later } from '@ember/runloop';
import { merge, assign as emberAssign } from '@ember/polyfills';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import fetch from 'fetch';

const assign = emberAssign || merge;

const JSON_CONTENT_TYPE = 'application/vnd.api+json';

export default BaseAuthenticator.extend({
  serverTokenEndpoint: '/api/v1/auth/identity/callback',
  resourceName: 'user',
  tokenAttributeName: 'token',
  identificationAttributeName: 'username',

  messageBus: inject(),

  rejectWithXhr: deprecatingAlias('rejectWithResponse', {
    id: `ember-simple-auth.authenticator.reject-with-xhr`,
    until: '2.0.0'
  }),

  rejectWithResponse: false,

  restore(data) {
    return this._validate(data) ? Promise.resolve(data) : Promise.reject();
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
            response.json().then((json) => run(null, reject, json));
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

    return fetch(url, requestOptions);
  },

  _validate(data) {
    const tokenAttributeName = this.get('tokenAttributeName');
    const identificationAttributeName = this.get('identificationAttributeName');
    const resourceName = this.get('resourceName');
    const _data = data[resourceName] ? data[resourceName] : data;

    return !isEmpty(_data[tokenAttributeName]) && !isEmpty(_data[identificationAttributeName]);
  }
});
