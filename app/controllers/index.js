import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import TimelineItemNavControllerMixin from 'client/mixins/timeline-item-nav-controller';

export default Controller.extend(TimelineItemNavControllerMixin, {
  queryParams: ['timelineItemId'],
  timelineItemId: null,

  session: service(),

  modelIsPresent: notEmpty('model')
});
