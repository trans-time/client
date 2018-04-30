import Mixin from '@ember/object/mixin';
import DS from 'ember-data';

export default Mixin.create({
  timelineItem: DS.belongsTo('timeline-item')
});
