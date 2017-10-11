import DS from 'ember-data';
import RoutineInstance from './routine-instance';

export default RoutineInstance.extend({
  distance: DS.attr('number'),
  duration: DS.attr('number'),
  laps: DS.attr('number'),
  reps: DS.attr('number'),
  sets: DS.attr('number'),
  weight: DS.attr('number'),

  weightInMicrograms: Ember.computed({
    get() {
      return this.get('weight') * 1000000;
    }
  })
});
