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

const VerdictValidation = {
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

    const previousVerdict = this.get('report.verdicts.lastObject');
    const newVerdict = this.get('verdict').cloneAttrs(previousVerdict);

    this.set('changeset', new Changeset(newVerdict, lookupValidator(VerdictValidation), VerdictValidation));

    if (isBlank(this.get('changeset.banUserDuration'))) this.set('changeset.banUserDuration', 0);
    if (isBlank(this.get('changeset.lockCommentsDuration'))) this.set('changeset.lockCommentsDuration', 0);

    this.get('changeset').validate();
  },

  indictions: computed({
    get() {
      const thisReport = this.get('report');

      return this.get('report.indicted.indictions').filter((report) => (report !== thisReport || report.get('verdicts.length') > 0) && (report.get('wasViolation') || !report.get('resolved')));
    }
  }),

  deleteImageIds: computed({
    get() {
      return (this.get('changeset.deleteImageIds') || []).join(', ');
    },
    set(key, value) {
      this.set('changeset.deleteImageIds', value.split(',').map((id) => parseInt(id)).filter((id) => !isNaN(id)));

      return value;
    }
  }),

  openMaturityRating: computed('_openMaturityRating', 'changeset.actionChangeMaturityRating', {
    get() {
      return this.get('_openMaturityRating') || this.get('changeset.actionChangeMaturityRating');
    },
    set(key, value) {
      if (value === true) this.set('changeset.actionChangeMaturityRating', this.get('report.flaggable.maturityRating'))
      else this.set('changeset.actionChangeMaturityRating', null)

      return this.set('_openMaturityRating', value);
    }
  }),

  _submit(properties) {
    this.set('isSubmitting', true);

    const changeset = this.get('changeset');

    changeset.setProperties(properties);
    changeset.set('moderationReport', this.get('report'));
    changeset.set('moderator', this.get('currentUser.user'));

    changeset.save().then((verdict) => {
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
