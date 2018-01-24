import DS from 'ember-data';
import Notification from './notification';

export default Notification.extend({
  moderationWarning: DS.belongsTo('moderation-warning')
});
