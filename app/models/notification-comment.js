import DS from 'ember-data';
import Notification from './notification';

export default Notification.extend({
  comment: DS.belongsTo('comment'),

  totalComments: DS.attr('number')
});
