import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: ['timeline-item-nav-slideshow-panels'],
  attributeBindings: ['minHeightStyle:style'],

  didInsertElement() {
    this._carousel.addEventListener('scroll', (e) => {
      if (this._scrollNotificationsDisabled) return;

      this.slidePanels(this._carousel, this._carousel.scrollLeft);
    });

    return this._super(...arguments);
  },

  didReceiveAttrs() {
    this._super(...arguments);

    if (this.element) this._setOffsetLeft();
  },

  minHeightStyle: computed('defaultPanelHeight', {
    get() {
      return htmlSafe(`min-height: ${this.defaultPanelHeight}px;`);
    }
  }),

  _carousel: computed({
    get() {
      return this.element.querySelector('.timeline-item-nav-slideshow-panels-carousel');
    }
  }),

  _setOffsetLeft() {
    this._setPanelIndex();
    if (this.activePanels === this._carousel) return;
    this._disableScrollNotificationTask.perform();
    this._carousel.scrollLeft = this.scrollLeft;
  },

  _setPanelIndex() {
    let panelIndex = Math.round(this._carousel.scrollLeft / this._carousel.clientWidth);
    if (panelIndex > this.panels.length - 1) panelIndex = this.panels.length - 1;

    this.setPanelIndex(panelIndex);
  },

  _disableScrollNotificationTask: task(function * () {
    this.set('_scrollNotificationsDisabled', true);

    yield timeout(500);

    this.set('_scrollNotificationsDisabled', false);
  }).restartable(),

  actions: {
    hoverScroll(amount) {
      this._carousel.scrollLeft += amount;
    }
  }
});
