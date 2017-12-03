import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import { Promise } from 'rsvp';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['profile'],

  followDisabled: false,

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

  _disableFollowUntilResolved(cb) {
    this.set('followDisabled', true);

    new Promise((resolve) => {
      cb(resolve);
    }).then(() => {
      this.set('followDisabled', false);
    });
  },

  actions: {
    follow() {
      this._disableFollowUntilResolved((resolve) => {
        this.attrs.follow(this.get('user.user'), resolve);
      });
    },

    unfollow() {
      this._disableFollowUntilResolved((resolve) => {
        this.attrs.unfollow(this.get('currentFollow'), resolve);
      });
    }
  }
});
