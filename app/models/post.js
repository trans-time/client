import DS from 'ember-data';

export default DS.Model.extend({
  faves: DS.hasMany('fav', { inverse: 'post' }),
  currentUserFav: DS.belongsTo('fav'),
  images: DS.hasMany('image'),
  tags: DS.hasMany('tag'),
  user: DS.belongsTo('user'),

  text: DS.attr('string'),
  date: DS.attr('date'),
  totalStars: DS.attr('number'),
  totalSuns: DS.attr('number'),
  totalMoons: DS.attr('number'),
  totalFaves: DS.attr('number')
});
