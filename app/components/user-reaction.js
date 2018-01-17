import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'li',

  classNames: ['reaction-item'],

  user: oneWay('reaction.user'),

  iconType: computed('reaction.type', {
    get() {
      return `${this.get('reaction.type')}-o`;
    }
  })
});
