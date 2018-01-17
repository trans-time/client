import { belongsTo } from 'ember-cli-mirage';
import Notification from './notification';

export default Notification.extend({
  comment: belongsTo('comment')
});
