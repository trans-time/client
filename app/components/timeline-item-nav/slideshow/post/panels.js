import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: ['timeline-item-nav-slideshow-panels'],
  attributeBindings: ['style'],

  didInsertElement() {
    this.element.addEventListener('scroll', (e) => {
      if (this._scrollNotificationsDisabled) return;

      this.slidePanels(this.element, this.element.scrollLeft);
    });

    return this._super(...arguments);
  },

  didReceiveAttrs() {
    this._super(...arguments);

    if (this.element) this._setOffsetLeft();
  },

  style: computed('defaultPanelHeight', {
    get() {
      return htmlSafe(`min-height: ${this.defaultPanelHeight}px;`);
    }
  }),

  _setOffsetLeft() {
    this._setPanelIndex();
    if (this.activePanels === this.element) return;
    this._disableScrollNotificationTask.perform();
    this.element.scrollLeft = this.scrollLeft;
  },

  _setPanelIndex() {
    let panelIndex = Math.round(this.element.scrollLeft / this.element.clientWidth);
    if (panelIndex > this.panels.length - 1) panelIndex = this.panels.length - 1;

    this.setPanelIndex(panelIndex);
  },

  _disableScrollNotificationTask: task(function * () {
    this.set('_scrollNotificationsDisabled', true);

    yield timeout(500);

    this.set('_scrollNotificationsDisabled', false);
  }).restartable()
});
