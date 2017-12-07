import { computed, observer } from '@ember/object';
import { alias, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank, isPresent } from '@ember/utils';
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
    this.get('changeset').save().then(() => {
      this._stopEditing();
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

    follow() {
      this.authenticatedAction().then(() => {
        this._disableFollowUntilResolved((resolve) => {
          this.attrs.follow(this.get('user'), resolve);
        });
      });
    },

    startEditing() {
      this.set('changeset', new Changeset(this.get('user.userProfile'), lookupValidator(ProfileValidations), ProfileValidations));
      this.get('changeset').validate();
      this.set('isEditing', true);
    },

    unfollow() {
      this._disableFollowUntilResolved((resolve) => {
        this.attrs.unfollow(this.get('currentFollow'), resolve);
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
