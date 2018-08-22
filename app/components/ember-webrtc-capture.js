import Component from '@ember/component';
import { computed } from '@ember/object';
import { bind } from '@ember/runloop';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: ['ember-webrtc-capture'],
  _deviceIndex: 0,
  devices: computed(() => []),

  didInsertElement(...args) {
    this._super(...args);

    this._video = this.element.getElementsByTagName('VIDEO')[0];
    this._canvas = this.element.getElementsByTagName('CANVAS')[0];

    this._video.addEventListener('touchend', bind(this, () => this.get('_takePicture').perform()));
    this._video.addEventListener('click', bind(this, () => this.get('_takePicture').perform()));

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this.set('devices', devices.filter((device) => device.kind === 'videoinput'));
      this._startCamera();
    });
  },

  willDestroyElement(...args) {
    this._stopCamera();
    this._super(...args);
  },

  _startCamera() {
    this._stopCamera();

    const device = this.devices[this._deviceIndex];

    navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: device.deviceId } },
      audio: false
    }).then((stream) => {
      this.set('_stream', stream);
      this._video.srcObject = stream;
      this._video.play();
      this.set('videoIsFlipped', ['user', 'left', 'right'].indexOf(device.getCapabilities().facingMode[0]) > -1);
    });
  },

  _stopCamera() {
    if (this._video) {
      this._video.pause();
      this._video.srcObject = null;
    }

    const stream = this.get('_stream');

    if (stream) stream.getTracks()[0].stop();
  },

  _takePicture: task(function * () {
    var context = this._canvas.getContext('2d');
    this._canvas.width = this._video.videoWidth;
    this._canvas.height = this._video.videoHeight;
    context.save();
    if (this.get('videoIsFlipped')) context.scale(-1, 1);
    context.drawImage(this._video, 0, 0, this._video.videoWidth * (this.get('videoIsFlipped') ? -1 : 1), this._video.videoHeight);

    var data = this._canvas.toDataURL('image/jpeg', 1.0);

    this.attrs.takePicture(data);

    context.restore();

    yield timeout(100);
  }).drop(),

  actions: {
    switchCamera() {
      this._deviceIndex++;

      if (this._deviceIndex >= this.devices.length) this._deviceIndex = 0;

      this._startCamera();
    }
  }
});
