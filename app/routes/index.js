import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import { later } from '@ember/runloop';
import Route from '@ember/routing/route';
import TimelineItemNavRouteMixin from 'client/mixins/timeline-item-nav-route';

export default Route.extend(TimelineItemNavRouteMixin, {
  currentUser: service(),
  intl: service(),
  meta: service(),
  topBarManager: service(),

  user: alias('currentUser.user'),
  _timelineItems: alias('controller.model'),
  _defaultQueryParams: {
    timelineItemId: null,
    comments: null
  },

  _refreshTimelineItems() {
    this.refresh();
  },

  beforeModel(...args) {
    this._super(...args);

    this.get('topBarManager').showSearchBar();
  },

  model(params) {
    this.setProperties({
      reachedFirstTimelineItem: false,
      reachedLastTimelineItem: false
    });

    const user = this.get('user');

    if (isBlank(user)) return;

    return this.store.query('timeline-item', {
      sort: '-date',
      filter: {
        blocked: false,
        deleted: false,
        follower_id: user.get('id'),
        private: false,
        under_moderation: false
      },
      from_timeline_item_id: params.timelineItemId,
      page_size: 10,
      initial_query: true,
      include: 'post,post.images,reactions,user'
    });
  }
});
