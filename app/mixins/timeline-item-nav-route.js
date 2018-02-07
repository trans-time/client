import { assign } from '@ember/polyfills';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: {
    timelineItemId: {
      replace: true
    },
    comments: {
      replace: true
    }
  },

  messageBus: service(),
  router: service(),

  init(...args) {
    this._super(...args);

    this.get('messageBus').subscribe('userWasAuthenticated', this, this._refreshTimelineItems);
  },

  resetController(controller) {
    controller.setProperties(this.get('_defaultQueryParams'));

    this.get('router.location').setURL(window.location.href);

    this._super(...arguments);
  },

  _refreshTimelineItems() {
    const query = this.get('_timelineItems.query');
    const originalQueryClone = assign({}, query);

    query.refreshTimelineItemIds = this.get('_timelineItems.content').map((timelineItem) => timelineItem.id).join(',');

    this.store.query('timelineItem', query).then(() => {
      this.set('_timelineItems.query', originalQueryClone);
    });
  },

  actions: {
    deleteTimelineItem(timelineItem, resolve) {
      timelineItem.destroyRecord().finally(() => resolve());
    },

    loadMoreTimelineItems(resolve, reject, shouldProgress, fromTimelineItemId) {
      const query = this.get('_timelineItems.query');

      if (query.should_progress === shouldProgress && query.from_timeline_item_id === fromTimelineItemId) return reject();

      query.initial_query = false
      query.should_progress = shouldProgress;
      query.from_timeline_item_id = fromTimelineItemId;

      this.store.query('timelineItem', query).then((timelineItems) => {
        this.get('_timelineItems').pushObjects(timelineItems.get('content'));

        const reachedEnd = timelineItems.get('content.length') < query.page_size;

        resolve(shouldProgress ? { reachedFirstTimelineItem: reachedEnd } : { reachedLastTimelineItem: reachedEnd });
      }).catch(() => {
        reject();
      });
    }
  }
});
