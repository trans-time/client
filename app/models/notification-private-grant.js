import DS from 'ember-data';
import Notification from './notification';

export default Notification.extend({
  followed: DS.belongsTo('user', { inverse: null })
});
