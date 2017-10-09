import DS from 'ember-data';

export default DS.Model.extend({
  routineType: DS.belongsTo('routine-type', { polymorphic: true }),
  routineInstances: DS.hasMany('routine-instance', { polymorphic: true })
});
