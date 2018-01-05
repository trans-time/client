import DS from 'ember-data';

export default DS.Model.extend({
  newPassword: DS.attr('string'),
  previousPassword: DS.attr('string')
});
