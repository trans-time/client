import DS from 'ember-data';
import Notification from './notification';

export default Notification.extend({
  total: DS.attr('number')
});
