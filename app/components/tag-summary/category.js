import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    toggleTag(tag) {
      this.attrs.toggleTag(tag);
    }
  }
});
