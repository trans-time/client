import DS from 'ember-data';

export default DS.Model.extend({
  flaggable: DS.belongsTo('flaggable', { polymorphic: true }),

  attribute: DS.attr('string'),
  date: DS.attr('date'),
  text: DS.attr('string')
});
