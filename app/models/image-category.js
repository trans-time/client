import DS from 'ember-data';

export default DS.Model.extend({
  imageSets: DS.hasMany('image-set'),

  name: DS.attr('string')
});
