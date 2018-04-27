import DS from 'ember-data';

export default DS.Model.extend({
  userTagSummary: DS.belongsTo('user-tag-summary'),
  tag: DS.belongsTo('tag'),

  timelineItemIds: DS.attr()
});
