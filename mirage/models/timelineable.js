import { belongsTo } from 'ember-cli-mirage';
import Reactable from './reactable';

export default Reactable.extend({
  timelineItem: belongsTo('timeline-item', { inverse: 'timelineable' })
});
