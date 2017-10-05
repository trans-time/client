import Ember from 'ember';

export default Ember.Component.extend({
  previousInstance: Ember.computed.oneWay('routineInstance.previousInstance'),
  routine: Ember.computed.oneWay('routineInstance.routine'),
  routineType: Ember.computed.oneWay('routine.routineType'),

  name: Ember.computed.oneWay('routineType.name')
});
