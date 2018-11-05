import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: 'hover-nav',

  meta: service(),

  click() {
    if (!this.meta.usingTouch) this.scroll();
  },

  touchStart(e) {
    this.set('meta.usingTouch', true);

    const { clientX, clientY } = e.changedTouches[0];

    this.setProperties({
      clientX,
      clientY
    })

    this.touchTimerTask.perform();
  },

  touchEnd(e) {
    this.set('meta.usingTouch', true);

    const { clientX, clientY } = e.changedTouches[0];

    if (this.touchActivated && Math.abs(this.clientX - clientX) < 5 && Math.abs(this.clientY - clientY) < 5) {
      this.scroll();
    }
  },

  touchTimerTask: task(function * () {
    this.set('touchActivated', true);

    yield timeout(500);

    this.set('touchActivated', false);
  }).restartable()
});
