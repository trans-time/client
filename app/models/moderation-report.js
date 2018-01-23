import DS from 'ember-data';

export default DS.Model.extend({
  flaggable: DS.belongsTo('flaggable', { polymorphic: true }),
  flags: DS.hasMany('flag'),
  indicted: DS.belongsTo('user', { inverse: 'indictions' }),
  moderator: DS.belongsTo('user', { inverse: 'moderationReports' }),

  date: DS.attr('date'),
  moderatorComment: DS.attr('string'),
  resolved: DS.attr('boolean'),
  wasViolation: DS.attr('boolean'),

  actionDeletedFlaggable: DS.attr('boolean'),
  actionBannedUser: DS.attr('boolean')
});
