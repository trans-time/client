import DS from 'ember-data';

export default DS.Model.extend({
  followed: DS.belongsTo('user', { inverse: 'followers' }),
  follower: DS.belongsTo('user', { inverse: 'followeds' }),

  canViewPrivate: DS.attr('boolean'),
  hasRequestedPrivate: DS.attr('boolean')
});
