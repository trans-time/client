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
    const filter = isBlank(user) ? {
      query: "@celeste #welcome"
    } : {
      blocked: false,
      is_marked_for_deletion: false,
      follower_id: user.get('id'),
      is_private: false,
      is_under_moderation: false
    };

    return this.infinity.model('timeline-item', {
      sort: '-inserted_at',
      filter,
      from_timeline_item_id: params.timelineItemId,
      page_size: 10,
      initial_query: true,
      include: 'tags,post,post.images,reactions,reactions.user,user'
    });
  }
});
