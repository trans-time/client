import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  posts: hasMany('post'),
  routine: belongsTo('routine'),
  previousInstance: belongsTo('routineInstance', { inverse: null })
});
