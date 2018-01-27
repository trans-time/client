import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  comments: hasMany('comment'),
  relationships: hasMany('user', { inverse: null }),
  tags: hasMany('tag'),
  timelineable: belongsTo('timelineable', { polymorphic: true }),
  user: belongsTo('user')
});
