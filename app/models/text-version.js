import DS from 'ember-data';

export default DS.Model.extend({
  flaggable: DS.belongsTo('flaggable', { polymorphic: true }),

  attribute: DS.attr('string'),
  insertedAt: DS.attr('date'),
  text: DS.attr('string')
});
