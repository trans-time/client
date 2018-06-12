import DS from 'ember-data';
import { inject as service } from '@ember/service';
import config from 'client/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:basic',
  host: config.host,
  namespace: 'v1',

  paperToaster: service(),

  handleResponse(status, headers, payload, requestData) {
    if (this.isSuccess(status, headers, payload)) {
      return payload;
    } else if (this.isInvalid(status, headers, payload)) {
      this._popErrorToast(payload.errors);
      return new DS.InvalidError(payload.errors);
    }

    let errors          = this.normalizeErrorResponse(status, headers, payload);
    let detailedMessage = this.generatedDetailedMessage(status, headers, payload, requestData);

    this._popErrorToast(errors);

    switch (status) {
      case 401:
        return new DS.UnauthorizedError(errors, detailedMessage);
      case 403:
        return new DS.ForbiddenError(errors, detailedMessage);
      case 404:
        return new DS.NotFoundError(errors, detailedMessage);
      case 409:
        return new DS.ConflictError(errors, detailedMessage);
      default:
        if (status >= 500) {
          return new DS.ServerError(errors, detailedMessage);
        }
    }

    return new DS.AdapterError(errors, detailedMessage);
  },

  _popErrorToast(errors) {
    errors = errors.map((error) => {
      if (error.title.includes('.detail.')) {
        error.detail = error.title;
        error.title = error.title.split('.');
        error.title.pop();
        error.title[error.title.indexOf('detail')] = 'title';
        error.title = error.title.join('.');
      }

      return error;
    });

    this.get('paperToaster').showComponent('paper-toaster-error', {
      errors,
      toastClass: 'paper-toaster-error-container'
    });
  }
});
