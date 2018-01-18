import DS from 'ember-data';
import Notification from './notification';

export default Notification.extend({
  violationReport: DS.belongsTo('violation-report')
});
