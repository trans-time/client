import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  intl: service(),
  topBarManager: service(),

  model() {
    return this.infinityModel('fav', { perPage: 12, startingPage: 1, favableId: this.modelFor('comments.comment').id, favableType: 'comment', include: 'user, user.userProfile' });
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('comments.faves');

    this.get('topBarManager').setTitleLink(title, 'comments.comment', this.modelFor('comments.comment').id);
    this.set('titleToken', title);
  }
});
