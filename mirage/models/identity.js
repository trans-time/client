import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  searchQueries: hasMany('search-query'),
  userIdentities: hasMany('user-identity')
});
