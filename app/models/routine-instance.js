import DS from 'ember-data';

export default DS.Model.extend({
  posts: DS.hasMany('post'),
  routine: DS.belongsTo('routine'),
  previousInstance: DS.belongsTo('routine-instance', { inverse: null, polymorphic: true }),

  routineType: Ember.computed.readOnly('routine.routineType.content'),

  date: DS.attr('date'),
  frequency: DS.attr('number'),
  frequencyScale: DS.attr('number')
});
