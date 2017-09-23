import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['timeline-ui-pointer'],
  classNameBindings: ['directionClass', 'hidden'],

  directionClass: Ember.computed('direction', {
    get() {
      return `timeline-ui-pointer-${this.get('direction')}`;
    }
  }),

  chevronDirection: Ember.computed('direction', {
    get() {
      return `chevron-${this.get('direction')}`;
    }
  })
});
