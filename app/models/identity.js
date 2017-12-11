import DS from 'ember-data';

export default DS.Model.extend({
  userIdentities: DS.hasMany('userIdentities'),

  name: DS.attr('string')
});
