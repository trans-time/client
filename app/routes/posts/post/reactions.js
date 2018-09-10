import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  perPageParam: 'page_size',

  infinity: service(),
  intl: service(),
  topBarManager: service(),

  model() {
    return this.infinity.model('reaction', { perPage: 12, startingPage: 1, sort: '-inserted_at', filter: { post_id: this.modelFor('posts.post').id }, include: 'user' });
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('post.reactions');

    this.get('topBarManager').setTitleLink(title, 'posts.post', this.modelFor('posts.post').id);
    this.set('titleToken', title);
  }
});
