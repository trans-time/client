import { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  identity: DS.belongsTo('identity'),
  user: DS.belongsTo('user'),

  startDate: DS.attr('date'),
  endDate: DS.attr('date'),

  name: computed('_name', 'identity.name', {
    get() {
      return this.get('_name') || this.get('identity.name');
    },
    set(key, value) {
      return this.set('_name', value);
    }
  })
});
