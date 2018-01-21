import DS from 'ember-data';
import Notification from './notification';

export default Notification.extend({
  follower: DS.belongsTo('user', { inverse: null }),

  totalFollows: DS.attr('number')
});
