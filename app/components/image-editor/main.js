import { computed, get } from '@ember/object';
import { alias, oneWay, filter } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { isPresent } from '@ember/utils';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import getImageOrientation from 'client/utils/get-image-orientation';

const hasWebRTCSupport = isPresent(navigator.mediaDevices);

export default Component.extend({
  hasWebRTCSupport,
  hidden: true,
  cameraOn: false,

  classNames: ['image-editor'],

  currentUser: service(),
  messageBus: service(),
  store: service(),

  user: oneWay('currentUser.user'),

  _getRotation(orientation) {
    switch(orientation) {
      case 1: return 0;
      case 2: return 0;
      case 3: return 180;
      case 4: return 180;
      case 5: return 90;
      case 6: return 90;
      case 7: return 270;
      case 8: return 270;
    }
  },

  _closeCamera() {
    this.setProperties({
      cameraOn: false,
      hidden: true
    });
  },

  actions: {
    deleteImage(image) {
      this.attrs.removeImage(image);
      this.set('cameraOn', true);
    },

    openCamera() {
      if (this.cameraOn) {
        this._closeCamera();
      } else {
        this.setProperties({
          cameraOn: true,
          hidden: false
        });
      }
    },

    closeCamera() {
      this._closeCamera();
    },

    selectImage(image) {
      this.setProperties({
        hidden: false,
        cameraOn: false,
        displayImage: image
      })
    },

    sortEndAction() {
      this.get('panels').forEach((panel, index) => {
        panel.set('order', index);
      });
    },

    takePicture(dataUri) {
      this.attrs.addImage(dataUri);
    },

    uploadImage(file) {
      getImageOrientation(file.blob, (orientation) => {
        if (Math.abs(orientation) === 1) {
          file.readAsDataURL().then((dataUri) => {
            this.attrs.addImage(dataUri);
          });
        } else {
          const image = new Image();
          const rotation = this._getRotation(orientation);

          image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.height = [0, 180].indexOf(rotation) > -1 ? image.height : image.width;
            canvas.width =  [0, 180].indexOf(rotation) > -1 ? image.width : image.height;

            const ctx = canvas.getContext('2d');

            ctx.translate(canvas.width / 2,canvas.height / 2);
            ctx.rotate(rotation * Math.PI/180);
            if ([2,4,5,7].indexOf(orientation) > -1) ctx.scale(-1, 1);
            ctx.drawImage(image, -image.width / 2, -image.height / 2);
            this.attrs.addImage(canvas.toDataURL(file.blob.type, 1.0));
          }
          image.src = URL.createObjectURL(file.blob);
        }
      });
    }
  }
});
