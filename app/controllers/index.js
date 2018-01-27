import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import PostNavControllerMixin from 'client/mixins/post-nav-controller';

export default Controller.extend(PostNavControllerMixin, {
  queryParams: ['timelineItemId'],
  timelineItemId: null,

  session: service(),

  modelIsPresent: notEmpty('model')
});
