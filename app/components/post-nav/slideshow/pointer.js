import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['post-nav-slideshow-pointer'],
  classNameBindings: ['directionClass', 'hidden'],

  hidden: Ember.computed.not('icon'),

  directionClass: Ember.computed('direction', {
    get() {
      return `post-nav-slideshow-pointer-${this.get('direction')}`;
    }
  })
});
