import { computed, observer } from '@ember/object';
import { alias, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import { Promise } from 'rsvp';
import Component from '@ember/component';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateFormat,
  validateLength
} from 'ember-changeset-validations/validators';

const ProfileValidations = {
  description: [
    validateLength({ max: 1000 })
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

  actions: {
    cancelEditing() {
      this._stopEditing();
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

    updateEditing() {
      this.set('isSaving', true);
      this.get('changeset').save().then(() => {
        this._stopEditing();
        this.set('isSaving', false);
      });
    }
  }
});
