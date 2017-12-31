import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  faves: hasMany('fav', { inverse: 'favable' })
});
