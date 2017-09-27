import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  faves: hasMany('fav'),
  posts: hasMany('post'),
  tags: hasMany('tag')
});
