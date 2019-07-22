import Component from '@ember/component';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  intl: service(),
  cwManager: service(),
  modalManager: service(),

  approvedTimelineItemIds: oneWay('cwManager.approvedTimelineItemIds'),
  blacklistedTagIds: oneWay('cwManager.blacklistedTagIds'),

  contentIsViewable: computed('blacklistedTagIds', 'approvedTimelineItemIds', {
    get() {
      const blacklistedTagIds = this.get('blacklistedTagIds');
      const approvedTimelineItemIds = this.get('approvedTimelineItemIds');

      return approvedTimelineItemIds.includes(this.get('content.id')) || !this.get('content.tags').any((tag) => blacklistedTagIds.indexOf(tag.id) > -1);
    }
  }),

  actions: {
    approveTimelineItem() {
      this.get('cwManager').approveTimelineItem(this.get('content'));
    },

    toggleTag(tag) {
      if (this.get('blacklistedTagIds').includes(tag.id)) {
        this.get('cwManager').restoreBlacklistedTag(tag);
      } else {
        this.get('cwManager').blacklistTag(tag);
      }
    }
  }
});
