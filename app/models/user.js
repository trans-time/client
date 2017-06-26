import DS from 'ember-data';

export default DS.Model.extend({
  identities: DS.hasMany('identity'),
  posts: DS.hasMany('post'),

  username: DS.attr('string')
});
