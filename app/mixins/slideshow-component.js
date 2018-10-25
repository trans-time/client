import { observer } from '@ember/object';
import { not, or, equal, oneWay } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  classNameBindings: ['isCurrentTimelineItem'],
  attributeBindings: ['timelineItemId:data-timeline-item-id'],

  timelineItemId: oneWay('timelineItem.model.id'),

  didRender(...args) {
    this._super(...args);

    this._setupIntersectionObserver();
  },

  _setupIntersectionObserver() {
    if (this.intersectionObserver && this.element && !this._hasSetupIntersectionObserver) {
      this.intersectionObserver.observe(this.element);
      this.set('_hasSetupIntersectionObserver', true);
    }
  }
});
