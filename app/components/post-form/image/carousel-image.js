import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed'
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'img',
  attributeBindings: ['src', 'style'],

  positioning: oneWay('panel.positioning'),
  src: oneWay('panel.src'),

  style: computed('positioning.x', 'positioning.y', {
    get() {
      return htmlSafe(`object-position: ${this.get('positioning.x')}% ${this.get('positioning.y')}%`);
    }
  })
});
