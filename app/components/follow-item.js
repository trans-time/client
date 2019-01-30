import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank, isPresent } from '@ember/utils';
import Component from '@ember/component';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';

export default Component.extend(AuthenticatedActionMixin, {
  tagName: 'li',
  classNames: ['follow-item'],

  buttonDisabled: false,

  currentUser: service(),
  modalManager: service(),
  store: service(),

  currentUserModel: alias('currentUser.user'),
  followed: alias('follow.followed.content'),

  isCurrentUserFollower: computed('currentUserModel', 'followed', {
    get() {
      const { currentUserModel, followed } = this.getProperties('currentUserModel', 'followed');

      return isPresent(currentUserModel) && currentUserModel === followed;
    }
  }),

  currentFollow: computed('currentUserModel.followeds.[]', 'user', {
    get() {
      const { currentUserModel, user, followed } = this.getProperties('currentUserModel', 'user', 'followed');

      if (!currentUserModel) return;

      return currentUserModel.followeds.find((follow) => {
        const followed = follow.belongsTo('followed');

        return followed && followed.id() === user.get('id');
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
    grantPrivateAccess(e) {
      e.stopPropagation();
      e.preventDefault();
      const follow = this.get('follow');

      this.set('buttonDisabled', true);

      follow.setProperties({
        canViewPrivate: true,
        hasRequestedPrivate: false
      });

      follow.save().finally(() => {
        this.set('buttonDisabled', false);
      });
    },

    revokePrivateAccess(e) {
      e.stopPropagation();
      e.preventDefault();
      const follow = this.get('follow');

      this.set('buttonDisabled', true);

      follow.set('canViewPrivate', false);

      follow.save().finally(() => {
        this.set('buttonDisabled', false);
      });
    },

    follow() {
      this.authenticatedAction().then(() => {
        this._disableFollowUntilResolved((resolve) => {
          const followed = this.get('user');
          const follower = this.get('currentUserModel');
          const follow = this.store.createRecord('follow', {
            followed,
            follower
          });

          follow.save().catch(() => follow.deleteRecord()).finally(resolve);
        });
      });
    },

    unfollow() {
      this._disableFollowUntilResolved((resolve) => {
        const follow = this.currentFollow;

        if (isBlank(follow)) return resolve();

        follow.destroyRecord().finally(resolve);
      });
    }
  }
});
