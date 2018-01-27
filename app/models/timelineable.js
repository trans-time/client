import DS from 'ember-data';
import Reactable from './reactable';

export default Reactable.extend({
  timelineItem: DS.belongsTo('timeline-item')
});
