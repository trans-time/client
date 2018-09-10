import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  perPageParam: 'page_size',

  currentUser: service(),
  infinity: service(),

  model() {
    return this.infinity.model('moderation-report', { sort: 'is_resolved', filter: { should_ignore: false }, perPage: 10, startingPage: 1, include: 'flags,indicted,verdicts' });
  }
});
