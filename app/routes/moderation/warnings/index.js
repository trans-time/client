import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  perPageParam: 'page_size',

  currentUser: service(),

  model() {
    return this.infinityModel('moderation-report', { perPage: 12, startingPage: 1, filter: { indicted_id: this.get('currentUser.user.id') }, include: 'flags,comment,timeline_item,verdicts,verdicts.moderator' });
  }
});
