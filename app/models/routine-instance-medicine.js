import DS from 'ember-data';
import RoutineInstance from './routine-instance';

export default RoutineInstance.extend({
  density: DS.attr('number'),
  volume: DS.attr('number'),
  weight: DS.attr('number'),

  weightInMicrograms: Ember.computed.oneWay('weight')
});
