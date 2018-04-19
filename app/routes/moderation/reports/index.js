import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  currentUser: service(),

  model() {
    return this.infinityModel('moderation-report', { sort: '-resolved', perPage: 10, startingPage: 1, include: 'flags,indicted' });
  }
});
