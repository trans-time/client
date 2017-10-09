import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),

  language: DS.attr('string'),
  unitSystem: DS.attr('string'),
  unitSystemLength: DS.attr('string'),
  unitSystemVolume: DS.attr('string'),
  unitSystemWeight: DS.attr('string')
});
