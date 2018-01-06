import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(RouteTitleMixin, {
  linkRoute: 'comments.comment',

  intl: service(),

  model() {
    return this.store.query('fav', { favableId: this.modelFor('comments.comment').id, favableType: 'comment', include: 'user, user.userProfile' });
  },

  beforeModel(...args) {
    this._super(...args);

    this.set('linkModelId', this.modelFor('comments.comment').id);
    this.set('titleToken', this.get('intl').t('comments.faves'));
  }
});
