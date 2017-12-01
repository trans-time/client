import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['profile'],

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
      this.attrs.follow(this.get('user.user'));
    },

    unfollow() {
      this.attrs.unfollow(this.get('currentFollow'));
    }
  }
});
