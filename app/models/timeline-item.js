import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', { inverse: 'posts' }),
  relationships: DS.hasMany('user', { inverse: false }),
  tags: DS.hasMany('tag'),
  timelineable: DS.belongsTo('timelineable', { polymorphic: true }),

  deleted: DS.attr('boolean')
});
