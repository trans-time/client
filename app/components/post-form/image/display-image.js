import { computed } from '@ember/object';
import { alias, oneWay } from '@ember/object/computed'
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'img',
  classNames: ['post-form-display-image'],
  attributeBindings: ['src', 'style'],

  meta: service(),
  positioning: oneWay('displayImage.positioning'),
  src: oneWay('displayImage.src'),
  usingTouch: alias('meta.usingTouch'),

  dragState: computed(() => { return {} }),

  style: computed('positioning.x', 'positioning.y', {
    get() {
      return htmlSafe(`object-position: ${this.get('positioning.x')}% ${this.get('positioning.y')}%`);
    }
  }),

  mouseDown(...args) {
    this._super(...args);

    if (this.get('usingTouch')) return;
    this._startEvent(args[0]);
  },

  touchStart(...args) {
    this._super(...args);

    this.set('usingTouch', true);
    this._startEvent(args[0].changedTouches[0]);
  },

  _startEvent(e) {
    const dragState = this.get('dragState');

    dragState.diffX = 0;
    dragState.diffY = 0;
    dragState.currentX = e.clientX;
    dragState.currentY = e.clientY;
    dragState.active = true;
  },

  mouseMove(...args) {
    this._super(...args);

    if (this.get('usingTouch')) return;
    this._moveEvent(args[0]);
  },

  touchMove(...args) {
    this._super(...args);

    this._moveEvent(args[0].changedTouches[0]);
  },

  _moveEvent(e) {
    const dragState = this.get('dragState');
    if (!dragState.active) return;

    if (e.preventDefault) e.preventDefault();

    dragState.diffX = dragState.currentX - e.clientX;
    dragState.diffY = dragState.currentY - e.clientY;
    dragState.currentX = e.clientX;
    dragState.currentY = e.clientY;

    const ratio = this.element.naturalWidth / this.element.naturalHeight;
    const imageWidth = ratio * this.element.height;
    const percentMoveX = (dragState.diffX / this.element.width) * (this.element.width / imageWidth) * 100;
    const positioningX = this.get('positioning.x') + percentMoveX;

    const imageHeight = ratio * this.element.width;
    const percentMoveY = (dragState.diffY / this.element.height) * (this.element.height / imageHeight) * 100;
    const positioningY = this.get('positioning.y') + percentMoveY;

    this.set('positioning.x', Math.min(100, Math.max(0, positioningX)));
    this.set('positioning.y', Math.min(100, Math.max(0, positioningY)));
  },

  mouseUp(...args) {
    this._super(...args);

    if (this.get('usingTouch')) return;
    this._endEvent();
  },

  touchEnd(...args) {
    this._super(...args);

    this._endEvent();
  },

  _endEvent() {
    this.set('dragState.active', false);
  }
});
