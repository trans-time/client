import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  createRecord(store, type, snapshot) {
    let data = {};
    let serializer = store.serializerFor(type.modelName);
    let url = this.buildURL(type.modelName, null, snapshot, 'createRecord');

    serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

    return this.ajax(this._addQueryParams(url, snapshot), "POST", { data: data });
  },

  _addQueryParams(url, snapshot) {
    if (snapshot.adapterOptions && snapshot.adapterOptions.mailUnlockToken) {
      url += '?mail_unlock_token=' + snapshot.adapterOptions.mailUnlockToken;
    }

    return url;
  }
})
