import DS from 'ember-data';

export default DS.Model.extend({
  subscriptionType: DS.belongsTo('subscription-type'),
  user: DS.belongsTo('user')
});
