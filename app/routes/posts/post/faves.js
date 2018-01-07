import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(InfinityRoute, RouteTitleMixin, {
  linkRoute: 'posts.post',

  intl: service(),

  model() {
    return this.infinityModel('fav', { perPage: 12, startingPage: 1, favableId: this.modelFor('posts.post').id, favableType: 'post', include: 'user, user.userProfile' });
  },

  beforeModel(...args) {
    this._super(...args);

    this.set('linkModelId', this.modelFor('posts.post').id);
    this.set('titleToken', this.get('intl').t('post.faves'));
  }
});
