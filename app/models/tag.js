import DS from 'ember-data';

export default DS.Model.extend({
  posts: DS.hasMany('post'),
  tagCategory: DS.belongsTo('tag-category'),

  name: DS.attr('string')
});
