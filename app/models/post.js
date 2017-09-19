import DS from 'ember-data';

export default DS.Model.extend({
  images: DS.hasMany('image'),
  tags: DS.hasMany('post-tag'),
  user: DS.belongsTo('user'),

  text: DS.attr('string')
});
