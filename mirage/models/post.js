import { belongsTo, hasMany } from 'ember-cli-mirage';
import Timelineable from './timelineable';

export default Timelineable.extend({
  user: belongsTo('user', { inverse: 'posts' }),
  currentUserReaction: belongsTo('reaction', { inverse: 'currentUserReactionPost' }),
  comments: hasMany('comment'),
  panels: hasMany('panel', { polymorphic: true })
});
