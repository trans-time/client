import { getOwner } from '@ember/application';
import { computed, observer } from '@ember/object';
import { alias, filter, or } from '@ember/object/computed';
import { assign } from '@ember/polyfills';
import { inject as service } from '@ember/service';
import { isBlank, isNone, isPresent } from '@ember/utils';
import { Promise } from 'rsvp';
import fetch from 'fetch';
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
    validateLength({ max: 64 })
  ],
  pronouns: [
    validateLength({ max: 64 })
  ],
  website: [
    validateFormat({ type: 'url', allowBlank: true }),
    validateLength({ max: 100 })
  ]
};

export default Component.extend(AuthenticatedActionMixin, {
  classNames: ['profile', 'content-constraint'],

  followDisabled: false,
  isEditing: false,
  isSaving: false,

  messageBus: service(),
  modalManager: service(),
  fileQueue: service(),
  intl: service(),
  router: service(),
  currentUser: service(),
  paperToaster: service(),
  currentUserModel: alias('currentUser.user'),

  cancelDisabled: or('isSaving'),
  updateDisabled: or('changeset.isInvalid', 'changeset.isPristine', 'isSaving'),

  init(...args) {
    this._super(...args);

    this.get('messageBus').subscribe('currentUserLoaded', this, () => this.notifyPropertyChange('currentFollow'));
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

  currentBlock: computed('currentUserModel.blockeds.[]', 'user.id', {
    get() {
      const userId = this.get('user.id');
      const currentUser = this.get('currentUserModel');

      if (isBlank(currentUser) || currentUser.hasMany('blockeds').value() === null) return;

      return currentUser.get('blockeds').find((block) => {
        return block.belongsTo('blocked').id() === userId;
      });
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

  websiteDomain: computed('user.userProfile.website', {
    get() {
      const website = this.get('user.userProfile.website');

      if (website) return website.indexOf('http') === 0 ? website.split('//')[1] : website;
    }
  }),

  websiteHref: computed('user.userProfile.website', {
    get() {
      const website = this.get('user.userProfile.website');

      if (website) return website.indexOf('http') === 0 ? website : `http://${website}`;
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

  _deleteAvatar() {
    this.get('session').authorize('authorizer:basic', (key, authorization) => {

      const url = `${config.host}${config.rootURL}${getOwner(this).lookup('adapter:application').get('namespace')}/avatars`;
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization
        }
      }).then(() => {
        this._saveChanges();
      }).catch(() => this.set('isSaving', false));
    });
  },

  _uploadAvatar() {
    this.get('modalManager').open('uploading-modal');

    const blob = this.get('changeset.avatarUpload.content') || this.get('changeset.avatarUpload');
    blob.name = `avatar-${this.get('currentUserModel.username')}.${blob.type.split('/')[1]}`;
    const [newFile] = this.get('queue')._addFiles([blob], 'blob');
    const path = `${config.host}${config.rootURL}${getOwner(this).lookup('adapter:application').get('namespace')}/avatars`;
    this.get('session').authorize('authorizer:basic', (key, authorization) => {
      newFile.upload(path, { headers: { Authorization: authorization }}).then(() => {

        this._saveChanges();
      }).catch(() => {
        this.get('modalManager').close();
        this.set('isSaving', false);
        this.get('paperToaster').show(this.get('intl').t('upload.unsuccessful'), {
          duration: 4000,
          toastClass: 'paper-toaster-error-container'
        });
      });
    });
  },

  _saveChanges() {
    this.get('changeset').save().then((model) => {
      this._stopEditing();
      this.attrs.updateModel(this.get('user'));
    }).finally(() => {
      this.get('modalManager').close();
      this.set('isSaving', false);
    });
  },

  actions: {
    block() {
      this.authenticatedAction().then(() => {
        this._disableFollowUntilResolved((resolve) => {
          this.attrs.block(this.get('user'), resolve);
        });
      });
    },

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
      this.set('changeset', new Changeset(this.get('user.userProfile.content'), lookupValidator(ProfileValidations), ProfileValidations));
      this.get('changeset').validate();
      this.set('isEditing', true);
    },

    unblock() {
      this._disableFollowUntilResolved((resolve) => {
        this.attrs.unblock(this.get('currentBlock'), resolve);
      });
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
      if (isPresent(this.get('user.userProfile.avatar')) && isNone(this.get('changeset.avatar'))) this._deleteAvatar();
      else if (this.get('changeset.avatarUpload')) this._uploadAvatar();
      else this._saveChanges();
    }
  }
});
