import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import TimelineItemNavRouteMixin from 'client/mixins/timeline-item-nav-route';

export default Route.extend(TimelineItemNavRouteMixin, {
  queryParams: {
    query: {
      refreshModel: true
    }
  },

  intl: service(),
  topBarManager: service(),

  _timelineItems: alias('controller.model'),
  _defaultQueryParams: {
    query: '',
    timelineItemId: null,
    comments: null
  },

  afterModel(...args) {
    this._super(...args);

    const title = args[1].queryParams.query;

    this.get('topBarManager').showSearchBar(title);
  },

  model(params) {
    this.setProperties({
      reachedFirstTimelineItem: false,
      reachedLastTimelineItem: false
    });

    return this.infinity.model('timeline-item', {
      sort: '-inserted_at',
      filter: {
        blocked: false,
        is_marked_for_deletion: false,
        query: params.query,
        is_private: false,
        is_under_moderation: false
      },
      from_timeline_item_id: params.timelineItemId,
      page_size: 10,
      initial_query: true,
      include: 'post,post.images,reactions,reactions.user,user'
    });
  }
});
