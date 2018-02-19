import DS from 'ember-data';
import Flaggable from './flaggable';

export default Flaggable.extend({
  currentUserReaction: DS.belongsTo('reaction'),
  reactions: DS.hasMany('reaction', { inverse: 'reactable' }),

  moonCount: DS.attr('number'),
  starCount: DS.attr('number'),
  sunCount: DS.attr('number')
});
