import { belongsTo } from 'ember-cli-mirage';
import Notification from './notification';

export default Notification.extend({
  moderationReport: belongsTo('moderation-report')
});
