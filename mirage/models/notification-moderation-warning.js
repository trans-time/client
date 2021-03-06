import { belongsTo } from 'ember-cli-mirage';
import Notification from './notification';

export default Notification.extend({
  moderationWarning: belongsTo('moderation-warning')
});
