import DS from 'ember-data';

export default DS.Model.extend({
  post: DS.belongsTo('post'),
  routine: DS.belongsTo('routine'),

  distance: DS.attr('number'),
  duration: DS.attr('number'),
  frequency: DS.attr('number'),
  frequencyScale: DS.attr('number'),
  reps: DS.attr('number'),
  sets: DS.attr('number'),
  weight: DS.attr('number')
});
