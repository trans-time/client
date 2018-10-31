import Component from '@ember/component';
import { next } from '@ember/runloop';

export default Component.extend({
  classNames: ['timeline-item-nav-slideshow-panels'],

  didInsertElement() {
    this.element.addEventListener('scroll', (e) => {
      if (this.element.dataset.blockScrollListener) return true;
      
      document.querySelectorAll('.timeline-item-nav-slideshow-panels').forEach((element) => {
        if (element === this.element) return;
        
        element.dataset.blockScrollListener = true;
        element.scrollLeft = this.element.scrollLeft;

        next(() => delete element.dataset.blockScrollListener);
      });
    })
    return this._super(...arguments);
  }
});
