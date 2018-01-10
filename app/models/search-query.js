import DS from 'ember-data';

export default DS.Model.extend({
  identities: DS.hasMany('identity'),
  tags: DS.hasMany('identity'),
  users: DS.hasMany('user'),

  query: DS.attr('string')
});
