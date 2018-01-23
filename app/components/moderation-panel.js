import Component from '@ember/component';
import { computed } from '@ember/object';
import { not, or, readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateLength,
  validateNumber
} from 'ember-changeset-validations/validators';

const ModerationReportValidation = {
  banUserDuration: [
    validateNumber({ allowBlank: true, positive: true, integer: true })
  ],
  lockCommentsDuration: [
    validateNumber({ allowBlank: true, positive: true, integer: true })
  ],
  text: [
    validateLength({ max: 63206 })
  ]
};

export default Component.extend({
  classNames: ['moderation-panel'],

  currentUser: service(),
  intl: service(),
  paperToaster: service(),
  router: service(),

  disabled: or('changeset.isInvalid', 'isSubmitting'),

  disableBanDuration: not('changeset.actionBannedUser'),
  disableLockCommentsDuration: not('changeset.actionLockComments'),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('changeset', new Changeset(this.get('report'), lookupValidator(ModerationReportValidation), ModerationReportValidation));

    if (isBlank(this.get('changeset.banUserDuration'))) this.set('changeset.banUserDuration', 0);
    if (isBlank(this.get('changeset.lockCommentsDuration'))) this.set('changeset.lockCommentsDuration', 0);

    this.get('changeset').validate();
  },

  otherIndictions: computed({
    get() {
      const thisReport = this.get('report');

      return this.get('report.indicted.indictions').filter((report) => report !== thisReport && (report.get('wasViolation') || !report.get('resolved')));
    }
  }),

  _submit(properties) {
    this.set('isSubmitting', true);

    const changeset = this.get('changeset');

    changeset.setProperties(properties);
    changeset.set('moderator', this.get('currentUser.user'));

    changeset.save().then(() => {
      this.get('paperToaster').show(this.get('intl').t('moderationReport.successful'), {
        duration: 4000
      });
      this.get('router').transitionTo('moderation.reports');
    }).catch(() => {
      this.get('paperToaster').show(this.get('intl').t('moderationReport.unsuccessful'), {
        duration: 4000
      });
    }).finally(() => {
      this.set('isSubmitting', false);
    });
  },

  actions: {
    shrink() {
      this.set('state', undefined);
    },

    displayFlags() {
      this.set('state', 'flags');
    },

    displayForm() {
      this.set('state', 'form');
    },

    displayHistory() {
      this.set('state', 'history');
    },

    toggleComments() {
      this.get('commentsAreOpen') ? this.attrs.closeComments() : this.attrs.openComments();
    },

    markAsNotViolation() {
      this._submit({
        resolved: true,
        wasViolation: false
      });
    },

    markAsViolation() {
      this._submit({
        resolved: true,
        wasViolation: true
      });
    }
  }
});
