import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),
  topBarManager: service(),

  afterModel() {
    const title = this.get('intl').t('post.viewPost');
    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);

    this._super(...arguments);
  },

  actions: {
    deleteTimelineable(timelineable, resolve, reject) {
      timelineable.set('timelineItem.deleted', true);
      timelineable.deleteRecord();

      timelineable.save().then(() => {
        resolve();
      }).catch(() => {
        timelineable.rollbackAttributes();
        reject();
      });
    },

    loadMoreTimelineItems(resolve, reject, shouldProgress) {
      resolve(shouldProgress ? { reachedFirstTimelineItem: true } : { reachedLastTimelineItem: true });
    }
  }
});
