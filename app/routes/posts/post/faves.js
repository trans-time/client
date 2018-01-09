import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  intl: service(),
  topBarManager: service(),

  model() {
    return this.infinityModel('fav', { perPage: 12, startingPage: 1, favableId: this.modelFor('posts.post').id, favableType: 'post', include: 'user, user.userProfile' });
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('post.faves');

    this.get('topBarManager').setTitleLink(title, 'posts.post', this.modelFor('posts.post').id);
    this.set('titleToken', title);
  }
});
