import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: ['ember-webrtc-capture'],

  didInsertElement(...args) {
    this._super(...args);

    this._video = this.element.getElementsByTagName('VIDEO')[0];
    this._canvas = this.element.getElementsByTagName('CANVAS')[0];

    navigator.mediaDevices.getUserMedia({
      video: { width: 5000, height: 8000 },
      audio: false
    }).then((stream) => {
      var vendorURL = window.URL || window.webkitURL;
      this._video.src = vendorURL.createObjectURL(stream);
      this._video.play();
    });
  },

  click() {
    this.get('_takePicture').perform();
  },

  touchEnd() {
    this.get('_takePicture').perform();
  },

  _takePicture: task(function * () {
    var context = this._canvas.getContext('2d');
    this._canvas.width = this._video.videoWidth;
    this._canvas.height = this._video.videoHeight;
    context.drawImage(this._video, 0, 0, this._video.videoWidth, this._video.videoHeight);

    var data = this._canvas.toDataURL('image/jpeg');

    this.attrs.takePicture(data);

    yield timeout(100);
  }).drop()
});
