import Component from '@ember/component';

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
    this._takePicture();
  },

  touchEnd() {
    this._takePicture();
  },

  _takePicture() {
    var context = this._canvas.getContext('2d');
    this._canvas.width = this._video.videoWidth;
    this._canvas.height = this._video.videoHeight;
    context.drawImage(this._video, 0, 0, this._video.videoWidth, this._video.videoHeight);

    var data = this._canvas.toDataURL('image/png');

    this.attrs.takePicture(data);
  }
});
