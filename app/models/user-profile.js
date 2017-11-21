import DS from 'ember-data';

export default DS.Model.extend({
  avatar: DS.attr('string'),
  description: DS.attr('string'),
  totalFollowing: DS.attr('number'),
  totalFollowers: DS.attr('number'),
  totalPosts: DS.attr('number'),

  user: DS.belongsTo('user'),
  userTagSummary: DS.belongsTo('user-tag-summary')
});
