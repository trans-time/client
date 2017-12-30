import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  tagName: 'a',
  classNames: ['post-nav-controls-element', 'fav-icon'],
  classNameBindings: ['faved', 'hidden', 'disabled'],
  attributeBindings: ['disabled', 'oncontextmenu'],

  meta: service(),
  usingTouch: alias('meta.usingTouch'),

  iconType: computed('type', {
    get() {
      return `${this.get('type')}-o`;
    }
  }),

  total: computed('type', 'shouldDisplayAllTypes', 'post.totalFaves', {
    get() {
      if (!this.get('shouldDisplayAllTypes')) {
        return this.get('post.totalFaves');
      } else {
        switch (this.get('type')) {
          case 'star': return this.get('post.totalStars');
          case 'sun': return this.get('post.totalSuns');
          case 'moon': return this.get('post.totalMoons')
        }
      }
    }
  }),

  oncontextmenu() {
    return false;
  },

  touchStart() {
    this.set('usingTouch', true);
    this.get('countdownToDisplayAllTypesTask').perform();
  },

  touchEnd() {
    this.endEvent();
  },

  mouseDown() {
    if (!this.get('usingTouch')) this.get('countdownToDisplayAllTypesTask').perform();
  },

  mouseUp() {
    if (!this.get('usingTouch')) this.endEvent();
  },

  countdownToDisplayAllTypesTask: task(function * () {
    if (this.get('shouldDisplayAllTypes')) return;

    yield timeout(200);

    this.attrs.displayAllTypes();
  }),

  endEvent() {
    this.get('countdownToDisplayAllTypesTask').cancelAll();

    if (this.get('isOpeningDisplayAllTypes')) {
      this.attrs.completeDisplayAllTypes();
    } else {
      this.attrs.selectType();
    }
  }
});
