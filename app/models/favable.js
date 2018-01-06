import DS from 'ember-data';

export default DS.Model.extend({
  currentUserFav: DS.belongsTo('fav'),
  faves: DS.hasMany('fav', { inverse: 'favable' })
});
