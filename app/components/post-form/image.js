import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  queueName: 'imageFile',

  currentUser: service(),
  fileQueue: service(),

  user: oneWay('currentUser.user'),

  queue: computed('queueName', {
    get() {
      let queueName = get(this, 'queueName');
      if (queueName != null) {
        let queues = get(this, 'fileQueue');
        return queues.find(queueName) ||
               queues.create(queueName);
      }
    }
  }),

  _dataURItoBlob(dataURL) {
    let [typeInfo, base64String] = dataURL.split(',');
    let mimeType = typeInfo.match(/:(.*?);/)[1];

    let binaryString = atob(base64String);
    let binaryData = new Uint8Array(binaryString.length);

    for (let i = 0, len = binaryString.length; i < len; i++) {
      binaryData[i] = binaryString.charCodeAt(i);
    }

    return new Blob([binaryData], { type: mimeType });
  },

  actions: {
    uploadImage(file) {
      this.attrs.uploadFileToRoute(file, 'image');
    },

    takePicture(dataUri) {
      const blob = this._dataURItoBlob(dataUri);
      blob.name = `${this.get('user.username')}-${Date.now()}.jpeg`;
      const [file] = this.get('queue')._addFiles([blob], 'blob');

      this.attrs.uploadFileToRoute(file, 'image');
    }
  }
});
