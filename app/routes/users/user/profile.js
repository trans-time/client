import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import Route from '@ember/routing/route';

export default Route.extend({
  currentUser: service(),

  currentUserModel: alias('currentUser.user'),

  actions: {
    block(blocked, resolve) {
      const blocker = this.get('currentUserModel');
      const block = this.store.createRecord('block', {
        blocked,
        blocker
      });

      block.save().catch(() => block.deleteRecord()).finally(resolve);
    },

    follow(followed, resolve) {
      const follower = this.get('currentUserModel');
      const follow = this.store.createRecord('follow', {
        followed,
        follower
      });

      follow.save().catch(() => follow.deleteRecord()).finally(resolve);
    },

    requestPrivate(follow, resolve) {
      if (follow.get('requestedPrivate')) return resolve();

      follow.set('requestedPrivate', true);

      follow.save().catch(() => follow.set('requestedPrivate', false)).finally(resolve);
    },

    unblock(block, resolve) {
      if (isBlank(block)) return resolve();

      block.destroyRecord().finally(resolve);
    },

    unfollow(follow, resolve) {
      if (isBlank(follow)) return resolve();

      follow.destroyRecord().finally(resolve);
    }
  }
});
