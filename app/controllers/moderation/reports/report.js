import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import TimelineItemNavControllerMixin from 'client/mixins/timeline-item-nav-controller';

export default Controller.extend(TimelineItemNavControllerMixin, {
  isComment: computed('model.report.flaggable.constructor.modelName', {
    get() {
      const isComment = this.get('model.report.flaggable.constructor.modelName') === 'comment';

      this.set('comments', isComment ? true : undefined);

      return isComment;
    }
  })
});
