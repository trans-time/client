import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  currentUser: service(),

  model() {
    return this.infinityModel('flag', { perPage: 12, startingPage: 1, userId: this.get('currentUser.user.id') });
  }
});
