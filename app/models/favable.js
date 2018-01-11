import DS from 'ember-data';
import Flaggable from './flaggable';

export default Flaggable.extend({
  currentUserFav: DS.belongsTo('fav'),
  faves: DS.hasMany('fav', { inverse: 'favable' })
});
