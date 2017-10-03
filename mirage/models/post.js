import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  user: belongsTo('user'),
  currentUserFav: belongsTo('fav', { inverse: 'currentUserFavPost' }),
  faves: hasMany('fav', { inverse: 'post' }),
  panels: hasMany('panel', { polymorphic: true }),
  tags: hasMany('tag')
});
