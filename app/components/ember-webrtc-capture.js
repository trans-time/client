import Component from '@ember/component';
import { bind } from '@ember/runloop';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: ['ember-webrtc-capture'],
  facingMode: 'environment',

  didInsertElement(...args) {
    this._super(...args);

    this._video = this.element.getElementsByTagName('VIDEO')[0];
    this._canvas = this.element.getElementsByTagName('CANVAS')[0];

    this._video.addEventListener('touchend', bind(this, () => this.get('_takePicture').perform()));
    this._video.addEventListener('click', bind(this, () => this.get('_takePicture').perform()));

    this._startCamera();
  },

  willDestroyElement(...args) {
    this._super(...args);

    const stream = this.get('stream');

    if (stream) stream.getTracks()[0].stop();
  },

  _startCamera() {
    console.log(this.facingMode)
    navigator.mediaDevices.getUserMedia({
      video: { width: 5000, height: 8000, facingMode: { exact: this.facingMode } },
      audio: false
    }).then((stream) => {
      this.set('_stream', stream);
      var vendorURL = window.URL || window.webkitURL;
      this._video.src = vendorURL.createObjectURL(stream);
      this._video.play();
    });
  },

  _takePicture: task(function * () {
    var context = this._canvas.getContext('2d');
    this._canvas.width = this._video.videoWidth;
    this._canvas.height = this._video.videoHeight;
    context.drawImage(this._video, 0, 0, this._video.videoWidth, this._video.videoHeight);

    var data = this._canvas.toDataURL('image/jpeg', 1.0);

    this.attrs.takePicture(data);

    yield timeout(100);
  }).drop(),

  actions: {
    switchCamera() {
      this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';

      this._startCamera();
    }
  }
});
