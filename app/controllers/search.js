import Controller from '@ember/controller';
import PostNavControllerMixin from 'client/mixins/post-nav-controller';

export default Controller.extend(PostNavControllerMixin, {
  queryParams: ['timelineItemId', 'query'],
  timelineItemId: null,
  query: null
});
