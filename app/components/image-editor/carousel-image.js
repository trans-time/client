import EmberObject, { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed'
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'a',

  classNames: ['image-editor-carousel-item'],

  positioning: oneWay('panel.positioning'),
  imgSrc: oneWay('panel.src'),

  imgOrderClassName: computed('panel.order', {
    get() {
      return `carousel-image-${this.get('panel.order')}`;
    }
  }),

  imgStyle: computed('positioning.x', 'positioning.y', {
    get() {
      return htmlSafe(`object-position: ${this.get('positioning.x')}% ${this.get('positioning.y')}%;`);
    }
  }),

  click() {
    this.select();
  },

  touchUp() {
    this.select();
  }
});
