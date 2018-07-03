import Component from '@ember/component';
import { computed } from '@ember/object';
import { bind } from '@ember/runloop';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: ['ember-webrtc-capture'],
  _facingMode: 'environment',

  didInsertElement(...args) {
    this._super(...args);

    this._video = this.element.getElementsByTagName('VIDEO')[0];
    this._canvas = this.element.getElementsByTagName('CANVAS')[0];

    this._video.addEventListener('touchend', bind(this, () => this.get('_takePicture').perform()));
    this._video.addEventListener('click', bind(this, () => this.get('_takePicture').perform()));

    this._video.style.width = document.width + 'px';
    this._video.style.height = document.height + 'px';
    this._video.setAttribute('autoplay', '');
    this._video.setAttribute('muted', '');
    this._video.setAttribute('playsinline', '');

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this._devices = devices.filter((device) => device.kind === 'videoinput');
      this._startCamera();
    });
  },

  willDestroyElement(...args) {
    this._super(...args);

    const stream = this.get('stream');

    if (stream) stream.getTracks()[0].stop();
  },

  _startCamera() {
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: this._facingMode },
      audio: false
    }).then((stream) => {
      this.set('_stream', stream);
      this._video.srcObject = stream;
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
      this._facingMode = this._facingMode === 'environment' ? 'user' : 'environment';

      this._startCamera();
    }
  }
});
