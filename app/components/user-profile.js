import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import { Promise } from 'rsvp';
import Component from '@ember/component';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';

export default Component.extend(AuthenticatedActionMixin, {
  classNames: ['profile'],

  followDisabled: false,

  messageBus: service(),
  currentUser: service(),
  currentUserModel: alias('currentUser.user'),

  init(...args) {
    this._super(...args);

    this.get('messageBus').subscribe('currentUserFollowsAreLoaded', this, () => this.notifyPropertyChange('currentFollow'));
  },

  currentFollow: computed('currentUserModel.followeds.[]', 'user.id', {
    get() {
      const userId = this.get('user.id');
      const currentUser = this.get('currentUserModel');
      
      if (isBlank(currentUser) || currentUser.hasMany('followeds').value() === null) return;

      return currentUser.get('followeds').find((follow) => {
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
      this.authenticatedAction().then(() => {
        this._disableFollowUntilResolved((resolve) => {
          this.attrs.follow(this.get('user'), resolve);
        });
      });
    },

    unfollow() {
      this._disableFollowUntilResolved((resolve) => {
        this.attrs.unfollow(this.get('currentFollow'), resolve);
      });
    }
  }
});
