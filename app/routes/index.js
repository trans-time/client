import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import { later } from '@ember/runloop';
import Route from '@ember/routing/route';
import PostNavRouteMixin from 'client/mixins/post-nav-route';

export default Route.extend(PostNavRouteMixin, {
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

    return this.store.query('timeline-item', { followerId: user.get('id'), fromTimelineItemId: params.timelineItemId, perPage: 5, include: 'timelineable, timelineable.panels, timelineable.currentUserReaction, user' });
  }
});
