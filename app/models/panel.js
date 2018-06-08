import DS from 'ember-data';

export default DS.Model.extend({
  post: DS.belongsTo('post'),

  isMarkedForDeletion: DS.attr('boolean'),
  order: DS.attr('number'),
  src: DS.attr('string'),

  srcIsLoaded: false,
  srcShouldLoad: false
});
