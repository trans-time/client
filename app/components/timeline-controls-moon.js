import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['timeline-controls-element'],
  classNameBindings: ['mooned'],

  mouseDown() {
    this.get('startCountdown').perform();
  },

  touchStart() {
    this.get('startCountdown').perform();
  },

  mouseUp() {
    this.get('toggleMoon').perform();
  },

  touchEnd() {
    this.get('toggleMoon').perform();
  },

  startCountdown: task(function * () {
    yield timeout(750);

    this.set('displayCelestialOptions', true);
  }),

  toggleMoon: task(function * () {
    this.get('startCountdown').cancelAll();

    yield timeout(100);

    this.toggleProperty('mooned');
  }).drop()
});
