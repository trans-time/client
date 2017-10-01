import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  tags: DS.hasMany('tag'),

  summary: DS.attr()
});
