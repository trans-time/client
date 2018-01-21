import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),

  date: DS.attr('date'),
  followed: DS.attr('boolean'),
  seen: DS.attr('boolean')
});
