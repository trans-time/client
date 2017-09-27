import Ember from 'ember';

export default Ember.Component.extend({
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
