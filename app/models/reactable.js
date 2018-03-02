import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Flaggable from './flaggable';

export default Flaggable.extend({
  currentUser: service(),

  currentUserReaction: DS.belongsTo('reaction'),
  reactions: DS.hasMany('reaction'),

  moonCount: DS.attr('number'),
  starCount: DS.attr('number'),
  sunCount: DS.attr('number'),

  currentUserReaction: computed('currentUser.user.id', 'reactions.[]', {
    get() {
      const currentUserId = this.get('currentUser.user.id');

      return this.get('reactions').filter((reaction) => reaction.belongsTo('user').value().id === currentUserId)[0];
    }
  })
});
