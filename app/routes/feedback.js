import Route from '@ember/routing/route';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import {
  validateFormat,
  validateInclusion,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';

const FeedbackValidations = {
  body: [
    validateLength({ max: 1000, min: 1 }),
    validatePresence(true)
  ],
  email: [
    validateLength({ max: 1000 }),
    validateFormat({ type: 'email' })
  ]
};

export default Route.extend({
  model() {
    return new Changeset(this.get('store').createRecord('feedback'), lookupValidator(FeedbackValidations), FeedbackValidations);
  },

  actions: {
    cancel() {
      history.back();
    },

    submit(changeset) {
      changeset.save().then(() => {
        history.back();
      });
    }
  }
});
