import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import InfinityRoute from "ember-infinity/mixins/route";
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(InfinityRoute, RouteTitleMixin, {
  linkRoute: 'comments.comment',

  intl: service(),

  model() {
    return this.infinityModel('fav', { perPage: 12, startingPage: 1, favableId: this.modelFor('comments.comment').id, favableType: 'comment', include: 'user, user.userProfile' });
  },

  beforeModel(...args) {
    this._super(...args);

    this.set('linkModelId', this.modelFor('comments.comment').id);
    this.set('titleToken', this.get('intl').t('comment.faves'));
  }
});
