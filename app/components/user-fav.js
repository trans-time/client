import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'li',

  classNames: ['fav-item'],

  user: oneWay('fav.user'),

  iconType: computed('fav.type', {
    get() {
      return `${this.get('fav.type')}-o`;
    }
  })
});
