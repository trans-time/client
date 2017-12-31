import { Model, belongsTo, hasMany } from 'ember-cli-mirage';
import Favable from './favable';

export default Favable.extend({
  user: belongsTo('user'),
  currentUserFav: belongsTo('fav', { inverse: 'currentUserFavPost' }),
  comments: hasMany('comment'),
  panels: hasMany('panel', { polymorphic: true }),
  relationships: hasMany('user', { inverse: false }),
  tags: hasMany('tag')
});
