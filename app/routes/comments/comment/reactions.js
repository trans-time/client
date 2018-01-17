import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  intl: service(),
  topBarManager: service(),

  model() {
    return this.infinityModel('reaction', { perPage: 12, startingPage: 1, reactableId: this.modelFor('comments.comment').id, reactableType: 'comment', include: 'user, user.userProfile' });
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('comments.reactions');

    this.get('topBarManager').setTitleLink(title, 'comments.comment', this.modelFor('comments.comment').id);
    this.set('titleToken', title);
  }
});
