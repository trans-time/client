import Component from '@ember/component';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import { EKMixin, EKOnInsertMixin, keyUp } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  classNames: ['main-modal-content', 'share-modal'],

  modalManager: service(),

  fullShare: oneWay('options.fullShare'),
  timelineItemId: oneWay('options.timelineItemId'),
  keyboardFirstResponder: true,

  didInsertElement(...args) {
    this._super(...args);

    this.get('fullShare') ? this.set('selected', 0) : this.set('selected', 3);
  },

  _closeModel: on(keyUp('KeyX'), function() {
    this.get('modalManager').close();
  }),

  copyUrl: computed('selected', {
    get() {
      const href = location.href;
      const selected = this.get('selected');
      const timelineItemIdStartIndex = href.indexOf('timelineItemId=');
      let timelineItemIdEndIndex = href.slice(timelineItemIdStartIndex).indexOf('&');
      timelineItemIdEndIndex = timelineItemIdEndIndex === -1 ? href.length : timelineItemIdEndIndex - 1;

      switch (selected) {
        case 0: return `${href.slice(0, timelineItemIdStartIndex)}${href.slice(timelineItemIdEndIndex)}`;
        case 1: return href;
        case 2: return `${href.slice(0, timelineItemIdStartIndex)}${href.slice(timelineItemIdEndIndex)}&lastPost=true`;
        case 3: {
          const url = new URL(href);

          return `${url.origin}/timeline-items/${this.get('timelineItemId')}`;
        }
      }
    }
  }),

  actions: {
    selectBeginning() {
      this.set('selected', 0);
    },

    selectHere() {
      this.set('selected', 1);
    },

    selectEnd() {
      this.set('selected', 2);
    },

    selectPost() {
      this.set('selected', 3);
    },

    copied() {
      this.get('modalManager').close();
    }
  }
});
