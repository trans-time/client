import DS from 'ember-data';
import Notification from './notification';

export default Notification.extend({
  reaction: DS.belongsTo('reaction')
});
