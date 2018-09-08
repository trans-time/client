import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  perPageParam: 'page_size',

  intl: service(),
  topBarManager: service(),

  model() {
    return this.infinityModel('reaction', { perPage: 12, startingPage: 1, sort: '-inserted_at', filter: { comment_id: this.modelFor('comments.comment').id }, include: 'user' });
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('comments.reactions');

    this.get('topBarManager').setTitleLink(title, 'comments.comment', this.modelFor('comments.comment').id);
    this.set('titleToken', title);
  }
});
