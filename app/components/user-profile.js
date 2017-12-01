import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['profile'],

  followDisabled: false,

  store: service(),
  currentUser: service(),
  currentUserModel: alias('currentUser.user'),

  currentFollow: computed('currentUserModel.followeds.[]', {
    get() {
      const userId = this.get('user.user.id');
      const follows = this.get('currentUserModel.followeds');

      return follows.find((follow) => {
        return follow.belongsTo('followed').id() === userId;
      });
    }
  }),

  actions: {
    follow() {
      this.set('followDisabled', true);

      const followed = this.get('user.user');
      const follower = this.get('currentUserModel');

      this.get('store').createRecord('follow', {
        followed,
        follower
      }).save().finally(() => {
        this.set('followDisabled', false);
      });
    },

    unfollow() {
      const currentFollow = this.get('currentFollow');

      if (isBlank(currentFollow)) return;

      this.set('followDisabled', true);

      currentFollow.destroyRecord().finally(() => {
        this.set('followDisabled', false);
      });
    }
  }
});
