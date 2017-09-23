import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['timeline-controls-element'],
  classNameBindings: ['mooned'],

  click() {
    this.get('toggleMoon').perform();
  },

  touchEnd() {
    this.get('toggleMoon').perform();
  },

  toggleMoon: task(function * () {
    yield timeout(100);

    this.toggleProperty('mooned');
  }).drop()
});
