import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['simle-form-controls'],

  actions: {
    handleCancel() {
      this.get('cancel')();
    },

    handleSubmit() {
      this.get('submit')();
    }
  }
});
