import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  blocked: belongsTo('user', { inverse: 'blockers' }),
  blocker: belongsTo('user', { inverse: 'blockeds' })
});
