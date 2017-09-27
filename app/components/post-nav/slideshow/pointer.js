import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['post-nav-slideshow-pointer'],
  classNameBindings: ['directionClass', 'hidden'],

  directionClass: Ember.computed('direction', {
    get() {
      return `post-nav-slideshow-pointer-${this.get('direction')}`;
    }
  }),

  chevronDirection: Ember.computed('direction', {
    get() {
      return `chevron-${this.get('direction')}`;
    }
  })
});
