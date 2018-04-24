import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  perPageParam: 'page_size',

  currentUser: service(),

  model() {
    return this.infinityModel('flag', { perPage: 12, startingPage: 1, include: 'moderation_report,moderation_report.verdicts,moderation_report.verdicts.moderator,comment,post' });
  }
});
