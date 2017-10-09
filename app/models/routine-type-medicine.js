import DS from 'ember-data';
import RoutineType from './routine-type';

// Dosage Form
// 0: oral
// 1: injection
// 2: topical
// 3: implant
// 4: suppository
// 5: vapor

export default RoutineType.extend({
  category: 'medicine',

  hasVolume: DS.attr('boolean'),
  hasWeight: DS.attr('boolean'),

  dosageForm: DS.attr('number')
});
