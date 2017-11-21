import DS from 'ember-data';

export default DS.Model.extend({
  avatar: DS.attr('string'),
  description: DS.attr('string'),

  user: DS.belongsTo('user'),
  userTagSummary: DS.belongsTo('user-tag-summary')
});
