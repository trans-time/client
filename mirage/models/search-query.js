import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  identities: hasMany('identity'),
  tags: hasMany('tag'),
  users: hasMany('user')
});
