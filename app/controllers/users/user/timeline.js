import Controller from '@ember/controller';
import PostNavControllerMixin from 'client/mixins/post-nav-controller';

export default Controller.extend(PostNavControllerMixin, {
  queryParams: ['timelineItemId', 'tags', 'relationships', 'lastPost'],
  lastPost: null,
  timelineItemId: null,
  tags: [],
  relationships: []
});
