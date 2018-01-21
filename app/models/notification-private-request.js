import DS from 'ember-data';
import Notification from './notification';

export default Notification.extend({
  follower: DS.belongsTo('user', { inverse: null }),

  totalRequests: DS.attr('number')
});
