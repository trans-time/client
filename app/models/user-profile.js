import DS from 'ember-data';

export default DS.Model.extend({
  avatar: DS.attr('string'),
  description: DS.attr('string'),
  displayName: DS.attr('string'),
  pronouns: DS.attr('string'),
  totalPosts: DS.attr('number'),
  website: DS.attr('string'),
  textVersions: DS.hasMany('text-version'),

  user: DS.belongsTo('user'),
  userTagSummary: DS.belongsTo('user-tag-summary')
});
