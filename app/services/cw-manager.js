import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  currentUser: service(),

  approvedTimelineItemIds: computed('currentUser.currentUserId', {
    get() {
      const cu = this.get('currentUser');
      const session = cu.getStorage(sessionStorage);
      const local = cu.getStorage(localStorage);

      return session.approvedTimelineItemIds.concat(local.approvedTimelineItemIds);
    }
  }),

  blacklistedTagIds: computed('currentUser.currentUserId', {
    get() {
      const cu = this.get('currentUser');
      const session = cu.getStorage(sessionStorage);
      const local = cu.getStorage(localStorage);

      return session.blacklistedTagIds.concat(local.blacklistedTagIds);
    }
  }),

  approveTimelineItem(timelineItem) {
    const cu = this.get('currentUser');
    const userSettings = cu.getStorage(localStorage);

    userSettings.approvedTimelineItemIds = userSettings.approvedTimelineItemIds.concat(timelineItem.id).filter((id, index, self) => {
      return self.indexOf(id) === index;
    });

    cu.setStorage(localStorage, userSettings);

    this.notifyPropertyChange('approvedTimelineItemIds');
  },

  stopApprovingTimelineItem(timelineItem) {
    const cu = this.get('currentUser');
    const userSettings = cu.getStorage(localStorage);

    userSettings.approvedTimelineItemIds = userSettings.approvedTimelineItemIds.filter((id) => id !== timelineItem.get('id'));

    cu.setStorage(localStorage, userSettings);

    this.notifyPropertyChange('approvedTimelineItemIds');
  },

  blacklistTag(tag) {
    const cu = this.get('currentUser');
    const userSettings = cu.getStorage(localStorage);

    userSettings.blacklistedTagIds = userSettings.blacklistedTagIds.concat(tag.id).filter((id, index, self) => {
      return self.indexOf(id) === index;
    });

    cu.setStorage(localStorage, userSettings);

    this.notifyPropertyChange('blacklistedTagIds');
  },

  restoreBlacklistedTag(tag) {
    const cu = this.get('currentUser');
    const userSettings = cu.getStorage(localStorage);

    userSettings.blacklistedTagIds = userSettings.blacklistedTagIds.filter((id) => id !== tag.id);

    cu.setStorage(localStorage, userSettings);

    this.notifyPropertyChange('blacklistedTagIds');
  }
});
