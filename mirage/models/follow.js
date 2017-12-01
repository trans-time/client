import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  followed: belongsTo('user', { inverse: 'followers' }),
  follower: belongsTo('user', { inverse: 'followeds' })
});
