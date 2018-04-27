import DS from 'ember-data';

export default DS.Model.extend({
  userTagSummary: DS.belongsTo('user-tag-summary'),
  user: DS.belongsTo('user'),

  timelineItemIds: DS.attr()
});
