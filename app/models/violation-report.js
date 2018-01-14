import DS from 'ember-data';

export default DS.Model.extend({
  flaggable: DS.belongsTo('flaggable', { polymorphic: true }),
  flags: DS.hasMany('flag'),
  indicted: DS.belongsTo('user', { inverse: 'indictions' }),
  moderator: DS.belongsTo('user', { inverse: 'violationReports' }),

  moderatorComment: DS.attr('text'),
  resolved: DS.attr('boolean'),
  wasViolation: DS.attr('boolean')
});
