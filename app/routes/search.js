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

    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);
  },

  model(params) {
    this.setProperties({
      reachedFirstTimelineItem: false,
      reachedLastTimelineItem: false
    });

    return this.store.query('timeline-item', {
      sort: '-date',
      filter: {
        query: params.query
      },
      from_timeline_item_id: params.timelineItemId,
      page_size: 10,
      initial_query: true,
      include: 'post,post.images,post.reactions,user'
    });
  }
});
