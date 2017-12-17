import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  user: belongsTo('user'),
  currentUserFav: belongsTo('fav', { inverse: 'currentUserFavPost' }),
  comments: hasMany('comment'),
  faves: hasMany('fav', { inverse: 'post' }),
  panels: hasMany('panel', { polymorphic: true }),
  relationships: hasMany('user', { inverse: false }),
  tags: hasMany('tag')
});
