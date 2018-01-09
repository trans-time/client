import { computed, observer } from '@ember/object';
import { alias, filter, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank, isNone, isPresent } from '@ember/utils';
import { Promise } from 'rsvp';
import Component from '@ember/component';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateFormat,
  validateLength
} from 'ember-changeset-validations/validators';
import config from '../config/environment';

const ProfileValidations = {
  description: [
    validateLength({ max: 1000 })
  ],
  displayName: [
    validateLength({ max: 100 })
  ],
  pronouns: [
    validateLength({ max: 64 })
  ],
  website: [
    validateFormat({ type: 'url', allowBlank: true })
  ]
};

export default Component.extend(AuthenticatedActionMixin, {
  classNames: ['profile'],

  followDisabled: false,
  isEditing: false,
  isSaving: false,

  messageBus: service(),
  modalManager: service(),
  fileQueue: service(),
  intl: service(),
  router: service(),
  currentUser: service(),
  currentUserModel: alias('currentUser.user'),

  cancelDisabled: or('isSaving'),
  updateDisabled: or('changeset.isInvalid', 'changeset.isPristine', 'isSaving'),

  init(...args) {
    this._super(...args);

    this.get('messageBus').subscribe('currentUserFollowsAreLoaded', this, () => this.notifyPropertyChange('currentFollow'));
  },

  _stopEditing: observer('user', function() {
    this.set('isEditing', false);
  }),

  queue: computed({
    get() {
      const queues = get(this, 'fileQueue');
      return queues.find('uploadQueue') ||
             queues.create('uploadQueue');
    }
  }),

  isCurrentUser: computed('currentUserModel', 'user', {
    get() {
      return this.get('currentUserModel') === this.get('user');
    }
  }),

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

  currentIdentities: filter('user.userIdentities', (userIdentity) => {
    return isNone(userIdentity.get('endDate'));
  }),

  websiteHref: computed('user.userProfile.website', {
    get() {
      const website = this.get('user.userProfile.website');

      return website.indexOf('http') === 0 ? website : `http://${website}`;
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

  _uploadAvatar() {
    try {
      const dataURL = this.get('changeset.avatar');
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      canvas.height = 145;
      canvas.width = 145;
      img.src = dataURL;

      img.onload = () => {
        canvas.toBlob((blob) => {
          blob.name = `avatar-${this.get('currentUserModel.username')}.jpeg`;
          const [newFile] = this.get('queue')._addFiles([blob], 'blob');
          newFile.upload(`${config.rootURL}user-profiles/upload`).then((result) => {
            this.set('changeset.avatar', get(result, 'body.data.attributes.src'));

            this._saveChanges();
          });
        }, 'image/jpeg');
      }
    } catch (e) {
      console.log(e); // eslint-disable-line
    }
  },

  _saveChanges() {
    this.get('changeset').save().then((model) => {
      this._stopEditing();
      this.attrs.updateModel(model);
    }).finally(() => {
      this.set('isSaving', false);
    });
  },

  actions: {
    cancelEditing() {
      this._stopEditing();
    },

    changeAvatar() {
      this.get('modalManager').open('user-profile/avatar-editor', null, null, { changeset: this.get('changeset') });
    },

    editIdentities() {
      this.get('router').transitionTo('users.user.identities.edit');
    },

    follow() {
      this.authenticatedAction().then(() => {
        this._disableFollowUntilResolved((resolve) => {
          this.attrs.follow(this.get('user'), resolve);
        });
      });
    },

    searchIdentity(identity) {
      this.get('router').transitionTo('search', { queryParams: { query: `*${identity}` }});
    },

    startEditing() {
      this.set('changeset', new Changeset(this.get('user.userProfile'), lookupValidator(ProfileValidations), ProfileValidations));
      this.get('changeset').validate();
      this.set('isEditing', true);
    },

    unfollow() {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('profile.unfollowConfirmation', { username: this.get('user.username') }) });
      }).then(() => {
        this._disableFollowUntilResolved((resolve) => {
          this.attrs.unfollow(this.get('currentFollow'), resolve);
        });
      });
    },

    requestPrivate() {
      this._disableFollowUntilResolved((resolve) => {
        this.attrs.requestPrivate(this.get('currentFollow'), resolve);
      });
    },

    updateEditing() {
      this.set('isSaving', true);
      if (isPresent(this.get('changeset.avatar'))) this._uploadAvatar();
      else this._saveChanges();
    }
  }
});
