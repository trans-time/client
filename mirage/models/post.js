import { Model, belongsTo, hasMany } from 'ember-cli-mirage';
import Reactable from './reactable';

export default Reactable.extend({
  user: belongsTo('user', { inverse: 'posts' }),
  currentUserReaction: belongsTo('reaction', { inverse: 'currentUserReactionPost' }),
  comments: hasMany('comment'),
  panels: hasMany('panel', { polymorphic: true }),
  relationships: hasMany('user', { inverse: false }),
  tags: hasMany('tag')
});
