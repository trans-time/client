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
      this.get('form.onSubmit')();
    }
  }
});
