import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),

  language: DS.attr('string'),
  unseenNotificationCount: DS.attr('number')
});
