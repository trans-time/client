import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  perPageParam: 'page_size',

  intl: service(),
  infinity: service(),
  topBarManager: service(),

  model() {
    return this.infinity.model('reaction', { perPage: 12, startingPage: 1, sort: '-inserted_at', filter: { comment_id: this.modelFor('comments.comment').id }, include: 'user' });
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('comments.reactions');

    this.get('topBarManager').setTitleLink(title, 'comments.comment', this.modelFor('comments.comment').id);
    this.set('titleToken', title);
  }
});
