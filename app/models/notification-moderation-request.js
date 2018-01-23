import DS from 'ember-data';
import Notification from './notification';

export default Notification.extend({
  moderationReport: DS.belongsTo('moderation-report')
});
