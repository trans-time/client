import DS from 'ember-data';
import Notification from './notification';

export default Notification.extend({
  report: DS.belongsTo('report')
});
