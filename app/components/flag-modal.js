import Component from '@ember/component';
import { inject as service } from '@ember/service';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateLength
} from 'ember-changeset-validations/validators';

const FlagValidations = {
  text: [
    validateLength({ max: 63206 })
  ]
};

export default Component.extend({
  classNames: ['main-modal-content'],

  intl: service(),
  modalManager: service(),
  paperToaster: service(),

  didReceiveAttrs(...args) {
    this._super(...args);

    this.set('changeset', new Changeset(this.get('options.flag'), lookupValidator(FlagValidations), FlagValidations));
    this.get('changeset').validate();
  },

  actions: {
    cancel() {
      this.get('modalManager').close('reject');
    },

    submit() {
      this.get('changeset').save().then(() => {
        this.get('modalManager').close('resolve');
        this.get('paperToaster').show(this.get('intl').t('flags.successful'), {
          duration: 4000
        });
      }).catch(() => {
        this.get('paperToaster').show(this.get('intl').t('flags.unsuccessful'), {
          duration: 4000
        });
      });
    }
  }
});
