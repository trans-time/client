import { computed, get } from '@ember/object';
import { alias, oneWay, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  cameraOn: true,
  queueName: 'imageFile',

  classNames: ['image-editor'],

  currentUser: service(),
  fileQueue: service(),
  messageBus: service(),
  store: service(),

  user: oneWay('currentUser.user'),
  sortedPanels: sort('panels', (a, b) => a.get('order') - b.get('order')),

  init(...args) {
    this._super(...args);

    this.get('messageBus').subscribe('didResize', this, this._adjustImageContainer);
  },

  _adjustImageContainer() {
    this.notifyPropertyChange('containerStyle');
  },

  didInsertElement(...args) {
    this._super(...args);

    Ember.run.later(() => {
      this.notifyPropertyChange('containerStyle');
    }, 100);
  },

  containerStyle: computed({
    get() {
      const $imageContainer = this.$();
      const destinationWidth = this.get('width');
      const destinationHeight = this.get('height');
      const height = $imageContainer.height();
      const width = $imageContainer.width();
      const idealWidth = height * (destinationWidth / destinationHeight);

      if (height >= destinationHeight && width >= destinationWidth) return htmlSafe('');
      else if (width > idealWidth) return htmlSafe(`height: ${height}px; width: ${idealWidth}px;`);
      else return htmlSafe(`height: ${width * (destinationHeight / destinationWidth)}px; width: ${width}px;`);
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
    let binaryData = new window.Uint8Array(binaryString.length);

    for (let i = 0, len = binaryString.length; i < len; i++) {
      binaryData[i] = binaryString.charCodeAt(i);
    }

    return new Blob([binaryData], { type: mimeType });
  },

  actions: {
    deleteImage(image) {
      this.attrs.removeImage(image);
      this.set('cameraOn', true);
    },

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

      this.attrs.addImage(file);
    },

    uploadImage(file) {
      this.attrs.addImage(file);
    }
  }
});
