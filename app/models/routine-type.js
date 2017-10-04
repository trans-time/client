import DS from 'ember-data';

export default DS.Model.extend({
  color: DS.attr('string'),
  icon: DS.attr('string'),
  name: DS.attr('string')
});
