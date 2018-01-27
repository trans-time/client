import { hasMany, belongsTo } from 'ember-cli-mirage';
import Reactable from './reactable';

export default Reactable.extend({
  timelineItem: belongsTo('timeline-item'),
  user: belongsTo('user'),
  parent: belongsTo('comment', { inverse: 'children' }),
  children: hasMany('comment', { inverse: 'parent' })
});
