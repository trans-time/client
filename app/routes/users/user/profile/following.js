import Route from '@ember/routing/route';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  perPageParam: 'page_size',

  model() {
    const user = this.modelFor('users.user');

    return this.infinityModel('follow', { perPage: 10, startingPage: 1, sort: '-inserted_at', filter: { follower_id: user.id }, include: 'followed,followed.user_profile' });
  }
});
