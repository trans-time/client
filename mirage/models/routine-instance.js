import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  routine: belongsTo('routine'),
  previousInstance: belongsTo('routineInstance', { inverse: null, polymorphic: true })
});
