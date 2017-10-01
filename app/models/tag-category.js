import DS from 'ember-data';

export default DS.Model.extend({
  tags: DS.hasMany('tag'),

  name: DS.attr('string')
});
