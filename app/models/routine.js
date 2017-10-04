import DS from 'ember-data';

export default DS.Model.extend({
  routineType: DS.belongsTo('routine-type'),
  routineInstances: DS.hasMany('routine-instance')
});
