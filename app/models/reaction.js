import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  comment: DS.belongsTo('comment'),
  post: DS.belongsTo('post'),
  user: DS.belongsTo('user'),

  reactionType: DS.attr('reaction-type'),

  reactable: computed('comment', 'post', {
    get() {
      return this.get('comment') || this.get('post');
    },
    set(key, reactable) {
      const type = reactable.constructor.modelName;

      this.set(type, reactable);
    }
  })
});
