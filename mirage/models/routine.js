import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  routineType: belongsTo('routine-type')
});
