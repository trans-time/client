import DS from 'ember-data';

export default DS.Model.extend({
  imageSet: DS.belongsTo('image-set'),

  src: DS.attr('string')
});
