import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  post: belongsTo('post'),
  user: belongsTo('user'),
  parent: belongsTo('comment', { inverse: 'children' }),
  children: hasMany('comment', { inverse: 'parent' })
});
