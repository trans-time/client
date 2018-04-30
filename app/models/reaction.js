import DS from 'ember-data';
import { computed } from '@ember/object';
import { camelize } from '@ember/string';

export default DS.Model.extend({
  comment: DS.belongsTo('comment'),
  timelineItem: DS.belongsTo('timelineItem'),
  user: DS.belongsTo('user'),

  reactionType: DS.attr('reaction-type'),

  reactable: computed('comment', 'timelineItem', {
    get() {
      return this.get('comment') || this.get('timelineItem');
    },
    set(key, reactable) {
      const type = reactable.constructor.modelName;

      this.set(camelize(type), reactable);
    }
  })
});
