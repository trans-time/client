import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  currentUser: service(),

  model() {
    return this.infinityModel('violation-report', { perPage: 12, startingPage: 1, moderatorId: this.get('currentUser.user.id'), include: 'flags, flaggable, flaggable.textVersions, flaggable.user, flaggable.panels, flaggable.post, flaggable.post.textVersions, flaggable.post.panels, flaggable.post.user' });
  }
});
