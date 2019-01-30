import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  perPageParam: 'page_size',

  infinity: service(),

  model() {
    const user = this.modelFor('users.user');

    return this.infinity.model('follow', { perPage: 10, startingPage: 1, sort: '-inserted_at', filter: { follower_id: user.id }, include: 'followed,followed.user_identities,followed.user_identities.identity' });
  }
});
