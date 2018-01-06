import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(RouteTitleMixin, {
  linkRoute: 'posts.post',

  intl: service(),

  model() {
    return this.store.query('fav', { favableId: this.modelFor('posts.post').id, favableType: 'post', include: 'user, user.userProfile' });
  },

  beforeModel(...args) {
    this._super(...args);

    this.set('linkModelId', this.modelFor('posts.post').id);
    this.set('titleToken', this.get('intl').t('post.faves'));
  }
});
