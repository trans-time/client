import { computed, observer } from '@ember/object';
import { oneWay, or, sort } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import SlideshowComponentMixin from 'client/mixins/slideshow-component';

export default Component.extend(SlideshowComponentMixin, {
  classNames: ['timeline-item-nav-slideshow-post'],
  classNameBindings: ['isBlank:timeline-item-nav-slideshow-post-blank', 'chatIsOpen'],

  isOutgoing: oneWay('timelineItem.isOutgoing'),
  isIncoming: oneWay('timelineItem.isIncoming'),
  isBlank: oneWay('timelineItem.isBlank'),
  keyboardActivated: oneWay('isCurrentPost'),
  modifiedPanelHeight: oneWay('panelHeight'),
  shouldRenderPost: or('visible', 'timelineItem.shouldPrerender'),
  sortedPanels: sort('timelineItem.panels', (a, b) => a.get('model.order') - b.get('model.order')),

  messageBus: service(),

  panelHeightIsModified: computed('panelHeight', 'modifiedPanelHeight', {
    get() {
      return this.get('panelHeight') !== this.get('modifiedPanelHeight');
    }
  }),

  _resetModifiedPanelHeight: observer('visible', function() {
    if (!this.get('visible')) this.set('modifiedPanelHeight', this.get('panelHeight'));
  }),

  post: computed({
    get() {
      return this.get('timelineItem.model.timelineable.content');
    }
  }),

  isCurrentTimelineItem: computed('timelineItem', 'navState.currentPanel.timelineItem', {
    get() {
      return this.get('timelineItem') === this.get('navState.currentPanel.timelineItem');
    }
  }),

  expandButtonDisabled: computed('modifiedPanelHeight', 'panelHeight', {
    get() {
      return this.get('modifiedPanelHeight') === this.get('panelHeight');
    }
  }),

  actions: {
    expandPanels() {
      this.set('modifiedPanelHeight', this.get('panelHeight'));
    },

    expendTextOnSwipe(amount) {
      const modifiedPanelHeight = Math.max(Math.min(this.get('panelHeight'), this.get('modifiedPanelHeight') + amount), this.get('panelHeight') / 3);
      this.set('modifiedPanelHeight', modifiedPanelHeight);
    },

    toggleChat() {
      this.attrs.toggleChat();
    },

    toggleHistory() {
      this.toggleProperty('historyIsRevealed');
    }
  }
});
