import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  post: DS.belongsTo('post'),
  parent: DS.belongsTo('comment', { inverse: 'children' }),
  children: DS.hasMany('comment', { inverse: 'parent' }),

  text: DS.attr('string'),
  date: DS.attr('number')
});
