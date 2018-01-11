import DS from 'ember-data';

export default DS.Model.extend({
  blocker: DS.belongsTo('user', { inverse: 'blockeds' }),
  blocked: DS.belongsTo('user', { inverse: 'blockers' })
});
