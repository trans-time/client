import DS from 'ember-data';
import Notification from './notification';

export default Notification.extend({
  reactable: DS.belongsTo('reactable', { polymorphic: true })
});
