import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['post-nav-controls-main'],

  quantifiablesLength: Ember.computed.oneWay('post.quantifiables.length'),
  noQuantifiables: Ember.computed.equal('quantifiablesLength', 0),

  actions: {
    toggleQuantifiables() {
      this.attrs.toggleQuantifiables();
    }
  }
});
