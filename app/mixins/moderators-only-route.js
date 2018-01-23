import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  currentUser: service(),
  router: service(),

  beforeModel() {
    if (!this.get('currentUser.user.isModerator')) return this.get('router').transitionTo('moderation.flags');

    this._super(...arguments);
  }
});
