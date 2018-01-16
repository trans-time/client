import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
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

  intl: service(),
  paperToaster: service(),
  router: service(),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('changeset', new Changeset(this.get('report'), lookupValidator(ViolationReportValidation), ViolationReportValidation));
    this.get('changeset').validate();
  },

  violations: computed({
    get() {
      const intl = this.get('intl');
      const flags = this.get('report.flags');

      return flags.reduce((accumulator, flag) => {
        ['bigotry', 'bot', 'harassment', 'sleaze', 'threat', 'unconsentingImage', 'unmarkedNSFW'].forEach((violation) => {
          if (flag.get(violation)) accumulator.incrementProperty(intl.t(`flags.attributes.${violation}.name`));
        });

        return accumulator;
      }, EmberObject.create());
    }
  }),

  _submit(properties) {
    const changeset = this.get('changeset');

    changeset.setProperties(properties);

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
    contractComments() {
      this.set('commentsExpanded', false);
    },

    expandComments() {
      this.set('commentsExpanded', true);
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
