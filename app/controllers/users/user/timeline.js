import Controller from '@ember/controller';
import PostNavControllerMixin from 'client/mixins/post-nav-controller';

export default Controller.extend(PostNavControllerMixin, {
  queryParams: ['tags', 'relationships', 'lastPost'],
  lastPost: null,
  tags: [],
  relationships: []
});
