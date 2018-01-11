import { belongsTo } from 'ember-cli-mirage';
import Flaggable from './flaggable';

export default Flaggable.extend({
  user: belongsTo('user'),
  favable: belongsTo('favable', { polymorphic: true })
});
