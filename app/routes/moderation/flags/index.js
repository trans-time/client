import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  perPageParam: 'page_size',

  currentUser: service(),
  infinity: service(),

  model() {
    return this.infinity.model('flag', { perPage: 12, startingPage: 1, include: 'moderation_report,moderation_report.verdicts,moderation_report.verdicts.moderator,comment,timeline_item' });
  }
});
