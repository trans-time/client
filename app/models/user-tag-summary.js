import DS from 'ember-data';

export default DS.Model.extend({
  author: DS.belongsTo('user'),
  subject: DS.belongsTo('user'),
  userTagSummaryTags: DS.hasMany('user-tag-summary-tag'),
  userTagSummaryUsers: DS.hasMany('user-tag-summary-user'),

  privateTimelineItemIds: DS.attr()
});
