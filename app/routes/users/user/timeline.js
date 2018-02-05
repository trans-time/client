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

  _timelineItems: alias('controller.model.timelineItems'),
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

    return hash({
      timelineItems: this.store.query('timeline-item', { userId: user.id, tags: params.tags, direction: params.direction, fromTimelineItemId: params.postId, lastTimelineItem: params.lastTimelineItem, perPage: 5, include: 'post,post.images,user' }),
      user
    });
  }
});
