import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['timeline-controls-element', 'fav-icon'],
  classNameBindings: ['faved', 'hidden'],

  meta: Ember.inject.service(),
  usingTouch: Ember.computed.alias('meta.usingTouch'),

  iconType: Ember.computed('type', {
    get() {
      return `${this.get('type')}-o`;
    }
  }),

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
