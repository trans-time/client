import DS from 'ember-data';

export default DS.Model.extend({
  flaggable: DS.belongsTo('flaggable', { polymorphic: true }),
  user: DS.belongsTo('user'),
  violationReport: DS.belongsTo('violation-report'),

  date: DS.attr('date'),
  text: DS.attr('string'),
  bigotry: DS.attr('boolean'),
  bot: DS.attr('boolean'),
  harassment: DS.attr('boolean'),
  sleaze: DS.attr('boolean'),
  threat: DS.attr('boolean'),
  unconsentingImage: DS.attr('boolean'),
  unmarkedNSFW: DS.attr('boolean')
});
