import DS from 'ember-data';

export default DS.Model.extend({
  followings: DS.hasMany('user'),
  user: DS.belongsTo('user'),

  language: DS.attr('string')
});
