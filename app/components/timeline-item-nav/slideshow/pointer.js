import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['timeline-item-nav-slideshow-pointer'],
  classNameBindings: ['directionClass', 'hidden'],

  hidden: not('icon'),

  directionClass: computed('direction', {
    get() {
      return `timeline-item-nav-slideshow-pointer-${this.get('direction')}`;
    }
  })
});
