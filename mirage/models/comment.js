import { hasMany, belongsTo } from 'ember-cli-mirage';
import Reactable from './reactable';

export default Reactable.extend({
  post: belongsTo('post'),
  user: belongsTo('user'),
  parent: belongsTo('comment', { inverse: 'children' }),
  children: hasMany('comment', { inverse: 'parent' })
});
