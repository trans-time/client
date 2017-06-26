import DS from 'ember-data';

export default DS.Model.extend({
  category: DS.belongsTo('image-category'),
  images: DS.hasMany('image'),
  post: DS.belongsTo('post')
});
