import { hasMany, belongsTo } from 'ember-cli-mirage';
import Favable from './favable';

export default Favable.extend({
  post: belongsTo('post'),
  user: belongsTo('user'),
  parent: belongsTo('comment', { inverse: 'children' }),
  children: hasMany('comment', { inverse: 'parent' })
});
