import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';

export default Component.extend({
  cameraOn: true,
  queueName: 'imageFile',

  classNames: ['post-form-image'],

  currentUser: service(),
  fileQueue: service(),
  messageBus: service(),

  user: oneWay('currentUser.user'),

  init(...args) {
    this._super(...args);

    this.get('messageBus').subscribe('didResize', this, this._adjustImageContainer);
  },

  _adjustImageContainer() {
    this.notifyPropertyChange('containerStyle');
  },

  containerStyle: computed({
    get() {
      const $imageContainer = this.$();
      const height = $imageContainer.height();
      const width = $imageContainer.width();
      const idealWidth = height * 0.8;

      if (height >= 1350 && width >= 1080) return htmlSafe('');
      else if (width > idealWidth) return htmlSafe(`height: ${height}px; width: ${idealWidth}px;`);
      else return htmlSafe(`height: ${width * 1.25}px; width: ${width}px;`);
    }
  }),

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
    openCamera() {
      this.set('cameraOn', true);
    },

    selectImage(image) {
      this.setProperties({
        cameraOn: false,
        displayImage: image
      })
    },

    takePicture(dataUri) {
      const blob = this._dataURItoBlob(dataUri);
      blob.name = `${this.get('user.username')}-${Date.now()}.jpeg`;
      const [file] = this.get('queue')._addFiles([blob], 'blob');

      this.attrs.uploadFileToRoute(file, 'image');
    },

    uploadImage(file) {
      this.attrs.uploadFileToRoute(file, 'image');
    }
  }
});
