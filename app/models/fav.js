import DS from 'ember-data';

export default DS.Model.extend({
  favable: DS.belongsTo('favable', { polymorphic: true }),
  user: DS.belongsTo('user'),

  type: DS.attr('fav-type')
});
