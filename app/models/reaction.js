import DS from 'ember-data';

export default DS.Model.extend({
  reactable: DS.belongsTo('reactable', { polymorphic: true }),
  user: DS.belongsTo('user'),

  type: DS.attr('reaction-type')
});
