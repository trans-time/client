import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  perPageParam: 'page_size',

  currentUser: service(),

  model() {
    return this.infinityModel('moderation-report', { sort: 'is_resolved', filter: { should_ignore: false }, perPage: 10, startingPage: 1, include: 'flags,indicted,verdicts' });
  }
});
