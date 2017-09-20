import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  images: hasMany('image'),
  tags: hasMany('tag')
});
