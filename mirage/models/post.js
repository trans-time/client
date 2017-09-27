import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  user: belongsTo('user'),
  faves: hasMany('fav'),
  images: hasMany('image'),
  tags: hasMany('tag')
});
