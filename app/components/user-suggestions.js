import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),
  infinity: service(),
  store: service(),

  users: computed({
    get() {
      return this.infinity.model('user', {
        sort: '-shared_identities,-post_count',
        filter: {
          limit: 24,
          no_prior_relation: true
        },
        include: 'user_identities,user_identities.identity'
      });
    }
  }),

  actions: {
    follow(user) {
      const follower = this.get('currentUser.user');
      const follow = this.store.createRecord('follow', {
        followed: user,
        follower
      });

      follow.save().catch(() => follow.deleteRecord());
    }
  }
});
