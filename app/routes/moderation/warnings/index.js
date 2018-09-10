import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  perPageParam: 'page_size',

  currentUser: service(),
  infinity: service(),

  model() {
    return this.infinity.model('moderation-report', { perPage: 12, startingPage: 1, filter: { indicted_id: this.get('currentUser.user.id') }, include: 'flags,comment,timeline_item,verdicts,verdicts.moderator' });
  }
});
