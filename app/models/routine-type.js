import DS from 'ember-data';

export default DS.Model.extend({
  color: DS.attr('string'),
  icon: DS.attr('string'),
  name: DS.attr('string'),

  hasDistance: DS.attr('boolean'),
  hasDuration: DS.attr('boolean'),
  hasReps: DS.attr('boolean'),
  hasSets: DS.attr('boolean'),
  hasWeight: DS.attr('boolean'),
  weightIsMicro: DS.attr('boolean')
});
