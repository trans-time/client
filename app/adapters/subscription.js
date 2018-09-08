import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  createRecord(store, type, snapshot) {
    let data = {};
    let serializer = store.serializerFor(type.modelName);
    let url = this.buildURL(type.modelName, null, snapshot, 'createRecord');

    serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

    return this.ajax(this._addQueryParams(url, snapshot), "POST", { data: data });
  },

  deleteRecord(store, type, snapshot) {
    let id = snapshot.id;
    let url = this.buildURL(type.modelName, id, snapshot, 'deleteRecord');

    return this.ajax(this._addQueryParams(url, snapshot), "DELETE");
  },

  _addQueryParams(url, snapshot) {
    if (snapshot.adapterOptions && snapshot.adapterOptions.mailSubscriptionToken) {
      url += '?mail_subscription_token=' + snapshot.adapterOptions.mailSubscriptionToken;
    }

    return url;
  }
})
