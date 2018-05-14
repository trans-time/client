import Mixin from '@ember/object/mixin';
import DS from 'ember-data';

export default Mixin.create({
  notification: DS.belongsTo('notification')
});
