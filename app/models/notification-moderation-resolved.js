import DS from 'ember-data';
import Notification from './notification';

export default Notification.extend({
  flag: DS.belongsTo('flag')
});
