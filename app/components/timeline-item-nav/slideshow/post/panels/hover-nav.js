import Component from '@ember/component';

export default Component.extend({
  classNames: 'hover-nav',

  mouseEnter() {
    this.set('active', true);

    const loop = (amount) => {
      requestAnimationFrame(() => {
        if (!this.active) return;

        this.hoverScroll(amount);

        loop(Math.max(Math.min(amount * 1.15, 15), -15));
      });
    }

    Ember.run.later(() => {
      loop(this.direction);
    }, 100);
  },

  mouseLeave() {
    this.set('active', false);
  },

  doubleClick(event) {
    this.element.style.pointerEvents = 'none';
    document.elementFromPoint(event.clientX, event.clientY).dispatchEvent(new MouseEvent('dblclick', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    }));
    this.element.style.pointerEvents = 'auto';
  }
});
