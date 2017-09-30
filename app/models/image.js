import DS from 'ember-data';

export default DS.Model.extend({
  post: DS.belongsTo('post'),

  src: DS.attr('string'),

  postNavComponent: 'post-nav/slideshow/image',

  isLoaded: false,
  shouldLoad: false
});
