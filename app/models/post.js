import DS from 'ember-data';

export default DS.Model.extend({
  imageSets: DS.hasMany('image-set'),
  tags: DS.hasMany('post-tag'),
  user: DS.belongsTo('user'),

  text: DS.attr('string')
});
