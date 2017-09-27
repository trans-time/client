import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  actions: {
    changePost(post) {
      this.set('post', post);
    }
  }
});
