import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default Component.extend({
  tag: '',

  disabled: alias('form.isInvalid'),

  actions: {
    handleCancel() {
      this.get('cancel')();
    },

    handleSubmit() {
      if (this.get('changeset')) {
        this.get('gRecaptcha').resetReCaptcha();
        window.grecaptcha.execute();
      } else {
        this.get('form.onSubmit')();
      }
    },

    onCaptchaResolved(reCaptchaResponse) {
      this.get('changeset').set('reCaptchaResponse', reCaptchaResponse);
      this.get('form.onSubmit')();
    }
  }
});
