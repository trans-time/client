import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNames: ['modal-nav'],
  attributeBindings: ['style'],

  modalManager: service(),
  panel: alias('modalManager.options.panel'),
  timelineItems: alias('modalManager.options.timelineItems'),

  scrollLeft: 0,

  didInsertElement() {
    this._scrollToInitialPanel();

    window.addEventListener('resize', () => {
      window.requestAnimationFrame(() => {
        this.notifyPropertyChange('style');
      });
    });

    this.element.addEventListener('scroll', (e) => {
      window.requestAnimationFrame(() => {
        const index = Math.floor(this.element.scrollTop / (this.element.clientHeight - 1));
        const currentTimelineItem = this.element.querySelectorAll('.timeline-item-nav-slideshow-panels-carousel')[index];
        this.modalManager.options.scrollToTimelineItem(currentTimelineItem.dataset.timelineItemId);
      });
    });

    return this._super(...arguments);
  },

  style: computed({
    get() {
      const { clientHeight, clientWidth } = document.body;
      const naturalHeight = 1800;
      const naturalWidth = 1440;
      const clientRatio = clientHeight / clientWidth;
      const naturalRatio = naturalHeight / naturalWidth;
      let height = naturalHeight;
      let width = naturalWidth;

      if (clientHeight >= naturalHeight && clientWidth >= naturalWidth) {
      } else if (clientRatio > naturalRatio) {
        width = Math.min(clientWidth, naturalWidth);
        height = width * naturalRatio;
      } else {
        height = Math.min(clientHeight, naturalHeight);
        width = height * (naturalWidth / naturalHeight);
      }
      return htmlSafe(`height: ${height}px; width: ${width}px;`);
    }
  }),

  _scrollToInitialPanel() {
    const timelineItemElement = this.element.querySelector(`[data-timeline-item-id="${this.get('panel.model.post.timelineItem.id')}"]`);
    const panelElement = timelineItemElement.querySelector(`[data-panel-id="${this.panel.model.id}"]`);

    this.element.scrollTop = timelineItemElement.getBoundingClientRect().top - this.element.getBoundingClientRect().top;
    timelineItemElement.scrollLeft = panelElement.getBoundingClientRect().left - timelineItemElement.getBoundingClientRect().left;
  },

  actions: {
    openModalNav() {
      this.modalManager.close();
    },

    slidePanels(activePanels, scrollLeft) {
      this.set('activePanels', activePanels);
      this.set('scrollLeft', scrollLeft);
    },

    scrollVertical(direction) {
      this.element.scrollTop += direction * this.element.querySelector('.timeline-item-nav-slideshow-panel').clientHeight;
    }
  }
});
