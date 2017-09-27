import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['post-nav-post'],

  didReceiveAttrs(...args) {
    this._super(...args);

    if (this.$()) this.$().animate({ scrollTop: 0 }, 'fast');
  }
});
