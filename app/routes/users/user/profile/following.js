import Route from '@ember/routing/route';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  model() {
    const user = this.modelFor('users.user');

    return this.infinityModel('follow', { perPage: 12, startingPage: 1, followerId: user.id, include: 'followed, followed.userProfile' });
  }
});
