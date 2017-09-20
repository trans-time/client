import DS from 'ember-data';

export default DS.Model.extend({
  images: DS.hasMany('image'),
  tags: DS.hasMany('tag'),
  user: DS.belongsTo('user'),

  text: DS.attr('string'),
  date: DS.attr('date')
});
