import { computed } from '@ember/object';
import { oneWay, or, sort } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import SlideshowComponentMixin from 'client/mixins/slideshow-component';
import { EKMixin, keyDown } from 'ember-keyboard';

export default Component.extend(EKMixin, SlideshowComponentMixin, {
  classNames: ['timeline-item-nav-slideshow-post'],
  classNameBindings: ['isBlank:timeline-item-nav-slideshow-post-blank'],

  isOutgoing: oneWay('timelineItem.isOutgoing'),
  isIncoming: oneWay('timelineItem.isIncoming'),
  isBlank: oneWay('timelineItem.isBlank'),
  keyboardActivated: oneWay('isCurrentPost'),
  shouldRenderPost: or('visible', 'timelineItem.shouldPrerender'),
  sortedPanels: sort('timelineItem.panels', (a, b) => a.get('model.order') - b.get('model.order')),

  messageBus: service(),

  _keyExpandCompressText: on(keyDown('KeyX'), function() {
    this.$('.timeline-item-nav-post-text').focus();
    this.get('textExpanded') ? this.attrs.compressText() : this.attrs.expandText();
    this.set('userRevealedText', true);
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

  resizeType: computed('panelCompressed', {
    get() {
      return this.get('panelCompressed') ? 'expand' : 'compress'
    }
  }),

  actions: {
    compress() {
      this.attrs.expandText();
    },

    expand() {
      this.attrs.compressText();
    },

    toggleChat() {
      this.attrs.toggleChat();
    }
  }
});
