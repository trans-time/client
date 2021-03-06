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

  infinity: service(),
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
    const refresh_ids = this.get('_timelineItems.content').map((timelineItem) => timelineItem.id);

    this.store.query('timelineItem', {
      filter: {
        refresh_ids
      },
      include: query.include,
      page_size: refresh_ids.length
    }).finally(() => {
      delete originalQueryClone.filter.refresh_ids;
      this.set('_timelineItems.query', originalQueryClone);
    });
  },

  actions: {
    deleteTimelineable(timelineable, resolve, reject) {
      timelineable.set('timelineItem.isMarkedForDeletion', true);
      timelineable.deleteRecord();

      timelineable.save().then(() => {
        resolve();
      }).catch(() => {
        timelineable.rollbackAttributes();
        reject();
      });
    },

    loadMoreTimelineItems(resolve, reject, shouldProgress, fromTimelineItemId) {
      const query = this.get('_timelineItems.extraParams');

      if (query.should_progress === shouldProgress && query.from_timeline_item_id === fromTimelineItemId) return reject();

      if (query.sort[0] !== '-') query.sort = `-${query.sort}`;
      query.initial_query = false
      query.should_progress = shouldProgress;
      query.from_timeline_item_id = fromTimelineItemId;

      this.set('_timelineItems.extraParams', query)

      const previousLength = this.get('_timelineItems.length');

      this.infinity.loadNextPage(this._timelineItems).then((timelineItems) => {
        const reachedEnd = timelineItems.get('content.length') - previousLength < 10;

        resolve(shouldProgress ? { reachedFirstTimelineItem: reachedEnd } : { reachedLastTimelineItem: reachedEnd });
      }).catch(() => reject());
    }
  }
});
