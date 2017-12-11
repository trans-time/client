import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  identity: belongsTo('identity'),
  user: belongsTo('user')
});
