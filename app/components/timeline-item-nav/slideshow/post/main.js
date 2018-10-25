import { computed, observer } from '@ember/object';
import { oneWay, or, sort } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';
import SlideshowComponentMixin from 'client/mixins/slideshow-component';

export default Component.extend(SlideshowComponentMixin, {
  classNames: ['timeline-item-nav-slideshow-post'],
  classNameBindings: ['isBlank:timeline-item-nav-slideshow-post-blank', 'chatIsOpen'],

  isOutgoing: oneWay('timelineItem.isOutgoing'),
  isIncoming: oneWay('timelineItem.isIncoming'),
  isBlank: oneWay('timelineItem.isBlank'),
  keyboardActivated: oneWay('isCurrentPost'),
  shouldRenderPost: or('visible', 'timelineItem.shouldPrerender'),
  sortedPanels: sort('timelineItem.panels', (a, b) => a.get('model.order') - b.get('model.order')),

  messageBus: service(),

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

  actions: {
    toggleChat() {
      this.attrs.toggleChat();
    },

    toggleHistory() {
      this.toggleProperty('historyIsRevealed');
    }
  }
});
