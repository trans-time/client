import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'li',
  classNames: ['follow-item'],

  buttonDisabled: false,

  currentUser: service(),
  currentUserModel: alias('currentUser.user'),
  followed: alias('follow.followed.content'),

  isCurrentUserFollower: computed('currentUserModel', 'followed', {
    get() {
      const { currentUserModel, followed } = this.getProperties('currentUserModel', 'followed');

      return isPresent(currentUserModel) && currentUserModel === followed;
    }
  }),

  actions: {
    grantPrivateAccess(e) {
      e.stopPropagation();
      e.preventDefault();
      const follow = this.get('follow');

      this.set('buttonDisabled', true);

      follow.setProperties({
        canViewPrivate: true,
        requestedPrivate: false
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
    }
  }
});
