import EmberObject, { computed, observer } from '@ember/object';
import { oneWay } from '@ember/object/computed'
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'a',

  classNames: ['image-editor-carousel-item'],

  positioning: oneWay('panel.positioning'),
  imgSrc: oneWay('panel.src'),

  didInsertElement() {
    const image = new Image();
    image.onload = this.drawImage.bind(this);
    image.src = this.imgSrc;

    this.set('image', image);

    return this._super(...arguments);
  },

  onPositioningChange: observer('positioning', function() {
    this.drawImage();
  }),

  canvas: computed({
    get() {
      const canvas = this.element.querySelector('canvas');
      canvas.width = this.element.clientWidth;
      canvas.height = this.element.clientHeight;

      return canvas;
    }
  }),

  ctx: computed({
    get() {
      return this.canvas.getContext('2d');
    }
  }),

  clearCtx() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  drawImage() {
    this.clearCtx();
    
    this.ctx.drawImage(
      this.image,
      this.positioning[0] * this.image.naturalWidth,
      this.positioning[1] * this.image.naturalHeight,
      (this.positioning[2] * this.image.naturalWidth) - (this.positioning[0] * this.image.naturalWidth),
      (this.positioning[3] * this.image.naturalHeight) - (this.positioning[1] * this.image.naturalHeight),
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  },

  click() {
    this.select();
  },

  touchUp() {
    this.select();
  }
});
