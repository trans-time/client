import Component from '@ember/component';

export default Component.extend({
  classNames: ['form-controls'],

  actions: {
    handleCancel() {
      this.get('cancel')();
    },

    handleSubmit() {
      this.get('submit')();
    }
  }
});
