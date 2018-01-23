import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateLength
} from 'ember-changeset-validations/validators';

const ViolationReportValidation = {
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

  disabled: readOnly('report.resolved'),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('changeset', new Changeset(this.get('report'), lookupValidator(ViolationReportValidation), ViolationReportValidation));
    this.get('changeset').validate();
  },

  otherIndictions: computed({
    get() {
      const thisReport = this.get('report');

      return this.get('report.indicted.indictions').filter((report) => report !== thisReport && (report.get('wasViolation') || !report.get('resolved')));
    }
  }),

  _submit(properties) {
    const changeset = this.get('changeset');

    changeset.setProperties(properties);
    changeset.set('moderator', this.get('currentUser.user'));

    changeset.save().then(() => {
      this.get('paperToaster').show(this.get('intl').t('violationReport.successful'), {
        duration: 4000
      });
      this.get('router').transitionTo('moderation.reports');
    }).catch(() => {
      this.get('paperToaster').show(this.get('intl').t('violationReport.unsuccessful'), {
        duration: 4000
      });
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
