import DS from 'ember-data';

export default DS.Model.extend({
  posts: DS.hasMany('post'),
  routine: DS.belongsTo('routine'),
  previousInstance: DS.belongsTo('routine-instance', { inverse: null }),

  date: DS.attr('date'),
  distance: DS.attr('number'),
  duration: DS.attr('number'),
  frequency: DS.attr('number'),
  frequencyScale: DS.attr('number'),
  reps: DS.attr('number'),
  sets: DS.attr('number'),
  weight: DS.attr('number')
});
