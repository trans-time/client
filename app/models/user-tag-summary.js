import DS from 'ember-data';

export default DS.Model.extend({
  userProfile: DS.belongsTo('user-profile'),
  tags: DS.hasMany('tag'),

  summary: DS.attr()
});
