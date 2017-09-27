import DS from 'ember-data';

export default DS.Model.extend({
  post: DS.belongsTo('post'),
  user: DS.belongsTo('user'),

  type: DS.attr('fav-type')
});
