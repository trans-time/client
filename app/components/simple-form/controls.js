import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['simple-form-controls'],

  actions: {
    handleCancel() {
      this.get('cancel')();
    },

    handleSubmit() {
      this.get('submit')();
    }
  }
});
