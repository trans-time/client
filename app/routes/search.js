import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import PostNavRouteMixin from 'client/mixins/post-nav-route';

export default Route.extend(PostNavRouteMixin, {
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

    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);
  },

  model(params) {
    this.setProperties({
      reachedFirstTimelineItem: false,
      reachedLastTimelineItem: false
    });

    return this.store.query('timeline-item', { query: params.query, fromTimelineItemId: params.timelineItemId, perPage: 5, include: 'timelineable, timelineable.panels, timelineable.currentUserReaction, user' });
  }
});
