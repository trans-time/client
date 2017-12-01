import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  currentUser: service(),
  user: alias('currentUser.user'),

  actions: {
    follow(followed) {
      const follower = this.get('user');

      this.store.createRecord('follow', {
        followed,
        follower
      }).save();
    },

    unfollow(follow) {
      follow.destroyRecord();
    }
  }
});
