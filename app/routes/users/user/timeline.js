import { alias } from '@ember/object/computed';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import TimelineItemNavRouteMixin from 'client/mixins/timeline-item-nav-route';

export default Route.extend(TimelineItemNavRouteMixin, {
  queryParams: {
    relationships: {
      refreshModel: true
    },
    tags: {
      refreshModel: true
    }
  },

  _timelineItems: alias('controller.model'),
  _defaultQueryParams: {
    tags: [],
    relationships: [],
    lastTimelineItem: null,
    timelineItemId: null,
    comments: null
  },

  model(params) {
    this.setProperties({
      reachedFirstTimelineItem: false,
      reachedLastTimelineItem: false
    });

    const user = this.modelFor('users.user');

    return this.store.query('timeline-item', {
      sort: params.lastTimelineItem ? 'date' : '-date',
      filter: {
        blocked: false,
        is_marked_for_deletion: false,
        is_private: false,
        tag_names: params.tags,
        is_under_moderation: false,
        user_id: user.id,
        user_usernames: [user.get('username'), ...params.relationships]
      },
      initial_query: true,
      from_timeline_item_id: params.timelineItemId,
      page_size: 10,
      include: 'post,post.images,reactions,user'
    })
  }
});
