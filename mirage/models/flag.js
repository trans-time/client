import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  flaggable: belongsTo('flaggable', { polymorphic: true }),
  user: belongsTo('user')
});
