import { hasMany } from 'ember-cli-mirage';
import Flaggable from './flaggable';

export default Flaggable.extend({
  reactions: hasMany('reaction', { inverse: 'reactable' })
});
