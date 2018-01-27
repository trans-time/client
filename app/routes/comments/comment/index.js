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
    deleteTimelineItem(timelineItem, resolve) {
      timelineItem.destroyRecord().finally(() => resolve());
    },

    loadMoreTimelineItems(resolve, reject, shouldProgress) {
      resolve(shouldProgress ? { reachedFirstTimelineItem: true } : { reachedLastTimelineItem: true });
    }
  }
});
