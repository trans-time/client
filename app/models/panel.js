import DS from 'ember-data';

export default DS.Model.extend({
  post: DS.belongsTo('post'),

  filename: DS.attr('string'),
  filesize: DS.attr('number'),
  order: DS.attr('number'),
  src: DS.attr('string'),

  srcIsLoaded: false,
  srcShouldLoad: false
});
