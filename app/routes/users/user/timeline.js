import { alias } from '@ember/object/computed';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import TimelineItemNavRouteMixin from 'client/mixins/timeline-item-nav-route';

export default Route.extend(TimelineItemNavRouteMixin, {
  queryParams: {
    tags: {
      refreshModel: true
    }
  },

  _timelineItems: alias('controller.model'),
  _defaultQueryParams: {
    tags: [],
    users: [],
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

    return this.store.query('timeline-item', { sort: '-date', filter: { user_id: user.id, user_ids: params.users, tag_ids: params.tags }, initial_query: true, from_timeline_item_id: params.timelineItemId, last_timeline_item: params.lastTimelineItem, page_size: 10, include: 'post,post.images,post.reactions,user' })
  }
});
