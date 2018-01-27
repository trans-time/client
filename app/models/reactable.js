import DS from 'ember-data';
import Flaggable from './flaggable';

export default Flaggable.extend({
  currentUserReaction: DS.belongsTo('reaction'),
  reactions: DS.hasMany('reaction', { inverse: 'reactable' }),

  totalMoons: DS.attr('number'),
  totalStars: DS.attr('number'),
  totalSuns: DS.attr('number')
});
