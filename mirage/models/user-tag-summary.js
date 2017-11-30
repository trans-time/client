import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  userProfile: belongsTo('user-profile'),
  relationships: hasMany('user'),
  tags: hasMany('tag')
});
