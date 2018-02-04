import DS from 'ember-data';

export default DS.Model.extend({
  comments: DS.hasMany('comment'),
  user: DS.belongsTo('user', { inverse: 'posts' }),
  tags: DS.hasMany('tag'),
  timelineable: DS.belongsTo('timelineable', { polymorphic: true }),
  users: DS.hasMany('user', { inverse: false }),

  commentsLocked: DS.attr('boolean'),
  date: DS.attr('date'),
  deleted: DS.attr('boolean'),
  private: DS.attr('boolean'),
  totalComments: DS.attr('number')
});
