import DS from 'ember-data';
import RoutineInstance from './routine-instance';

export default RoutineInstance.extend({
  weight: DS.attr('number'),

  weightInMicrograms: Ember.computed.oneWay('weight')
});
