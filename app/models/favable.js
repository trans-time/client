import DS from 'ember-data';

export default DS.Model.extend({
  currentUserFav: DS.belongsTo('fav'),
  faves: DS.hasMany('fav', { inverse: 'favable' }),

  totalStars: DS.attr('number'),
  totalSuns: DS.attr('number'),
  totalMoons: DS.attr('number'),
  totalFaves: DS.attr('number')
});
