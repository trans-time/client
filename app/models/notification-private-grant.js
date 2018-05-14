import DS from 'ember-data';
import NotifiableMixin from 'client/mixins/model-notifiable';

export default DS.Model.extend(NotifiableMixin, {
  followed: DS.belongsTo('user', { inverse: null }),

  totalGrants: DS.attr('number')
});
