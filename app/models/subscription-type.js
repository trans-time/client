import DS from 'ember-data';

export default DS.Model.extend({
  subscriptions: DS.hasMany('subscription'),
  
  name: DS.attr('string')
});
