import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Flaggable from './flaggable';

export default Flaggable.extend({
  currentUser: service(),

  reactions: DS.hasMany('reaction'),

  moonCount: DS.attr('number'),
  starCount: DS.attr('number'),
  sunCount: DS.attr('number'),

  currentUserReaction: computed('currentUser.user.id', 'reactions.[]', '_cachedCurrentUserReaction', {
    get() {
      const currentUserId = this.get('currentUser.user.id');

      return this.get('_cachedCurrentUserReaction') ||
        this.get('reactions').find((reaction) => reaction.belongsTo('user').value().id === currentUserId);
    },
    set(key, value) {
      return this.set('_cachedCurrentUserReaction', value);
    }
  })
});
