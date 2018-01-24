import DS from 'ember-data';

export default DS.Model.extend({
  moderationReport: DS.belongsTo('moderation-report'),
  indicted: DS.belongsTo('user')
});
