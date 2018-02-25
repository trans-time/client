import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import Route from '@ember/routing/route';

export default Route.extend({
  currentUser: service(),
  paperToaster: service(),

  currentUserModel: alias('currentUser.user'),

  _handleResponse(promise, resolve, reject = () => {}) {
    promise.catch(({ errors }) => {
      reject();
      this.get('paperToaster').showComponent('paper-toaster-error', {
        errors,
        toastClass: 'paper-toaster-error-container'
      });
    }).finally(() => {
      resolve();
    });
  },

  actions: {
    block(blocked, resolve) {
      const blocker = this.get('currentUserModel');
      const block = this.store.createRecord('block', {
        blocked,
        blocker
      });

      this._handleResponse(block.save(), resolve, () => {
        block.deleteRecord();
      });
    },

    follow(followed, resolve) {
      const follower = this.get('currentUserModel');
      const follow = this.store.createRecord('follow', {
        followed,
        follower
      });

      this._handleResponse(follow.save(), resolve, () => {
        follow.deleteRecord();
      });
    },

    requestPrivate(follow, resolve) {
      if (follow.get('requestedPrivate')) return resolve();

      follow.set('requestedPrivate', true);

      this._handleResponse(follow.save(), resolve, () => {
        follow.set('requestedPrivate', false);
      });
    },

    unblock(block, resolve) {
      if (isBlank(block)) return resolve();

      this._handleResponse(block.destroyRecord(), resolve);
    },

    unfollow(follow, resolve) {
      if (isBlank(follow)) return resolve();

      this._handleResponse(follow.destroyRecord(), resolve);
    }
  }
});
