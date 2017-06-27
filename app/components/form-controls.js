import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    handleCancel() {
      this.get('cancel')();
    },

    handleSubmit() {
      this.get('submit')();
    }
  }
});
