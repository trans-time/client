import { belongsTo } from 'ember-cli-mirage';
import Flaggable from './flaggable';

export default Flaggable.extend({
  user: belongsTo('user'),
  reactable: belongsTo('reactable', { polymorphic: true })
});
