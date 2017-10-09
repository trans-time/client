import DS from 'ember-data';
import RoutineType from './routine-type';

export default RoutineType.extend({
  hasDistance: DS.attr('boolean'),
  hasDuration: DS.attr('boolean'),
  hasReps: DS.attr('boolean'),
  hasSets: DS.attr('boolean'),
  hasWeight: DS.attr('boolean')
});
