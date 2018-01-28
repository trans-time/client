import Controller from '@ember/controller';
import TimelineItemNavControllerMixin from 'client/mixins/timeline-item-nav-controller';

export default Controller.extend(TimelineItemNavControllerMixin, {
  queryParams: ['timelineItemId', 'query'],
  timelineItemId: null,
  query: null
});
