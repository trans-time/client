import { hasMany } from 'ember-cli-mirage';
import Flaggable from './flaggable';

export default Flaggable.extend({
  faves: hasMany('fav', { inverse: 'favable' })
});
