import Component from '@ember/component';

export default Component.extend({
  tag: '',

  actions: {
    handleSubmit() {
      this.get('gRecaptcha').resetReCaptcha();
      window.grecaptcha.execute();
    },

    onCaptchaResolved(reCaptchaResponse) {
      this.get('changeset').set('reCaptchaResponse', reCaptchaResponse);
      this.submit(this.get('changeset'));
    }
  }
});
