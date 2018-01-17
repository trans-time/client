import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";

export default Route.extend(InfinityRoute, {
  intl: service(),
  topBarManager: service(),

  model() {
    return this.infinityModel('reaction', { perPage: 12, startingPage: 1, reactableId: this.modelFor('posts.post').id, reactableType: 'post', include: 'user, user.userProfile' });
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('post.reactions');

    this.get('topBarManager').setTitleLink(title, 'posts.post', this.modelFor('posts.post').id);
    this.set('titleToken', title);
  }
});
