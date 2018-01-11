import DS from 'ember-data';

export default DS.Model.extend({
  flags: DS.hasMany('flag', { inverse: 'flaggable' })
});
