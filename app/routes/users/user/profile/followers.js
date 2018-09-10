import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  perPageParam: 'page_size',

  infinity: service(),

  model() {
    const user = this.modelFor('users.user');

    return this.infinity.model('follow', { perPage: 10, startingPage: 1, sort: '-has_requested_private,-inserted_at', filter: { followed_id: user.id }, include: 'follower,followed' });
  }
});
