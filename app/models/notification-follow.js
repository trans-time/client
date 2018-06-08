import DS from 'ember-data';
import NotifiableMixin from 'client/mixins/model-notifiable';

export default DS.Model.extend(NotifiableMixin, {
  follow: DS.belongsTo('follow', { inverse: null })
});
