import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: 'hover-nav',

  click() {
    this.scroll(this.direction);
  },

  touchStart() {
    this.touchTimerTask.perform();
  },

  touchEnd() {
    if (this.touchActivated) this.scroll(this.direction);
  },

  touchTimerTask: task(function * () {
    this.set('touchActivated', true);

    yield timeout(500);

    this.set('touchActivated', false);
  }).restartable()
});
