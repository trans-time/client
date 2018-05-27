import PanelModel from './panel';
import { computed } from '@ember/object';

export default PanelModel.extend({
  postNavComponent: 'timeline-item-nav/slideshow/post/image',

  srcset: computed('src', {
    get() {
      const src750 = this.get('src');
      const src375 = src750.replace('/full_750.', '/full_375.');
      const src1080 = src750.replace('/full_750.', '/full_1080.');
      const src1440 = src750.replace('/full_750.', '/full_1440.');

      return `${src375} 375w, ${src750} 750w, ${src1080} 1080w, ${src1440} 1400w`;
    }
  })
});
