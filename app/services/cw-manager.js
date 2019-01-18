import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  currentUser: service(),

  approvedTagIds: computed('currentUser.currentUserId', {
    get() {
      const cu = this.get('currentUser');
      const session = cu.getStorage(sessionStorage);
      const local = cu.getStorage(localStorage);

      return session.approvedTagIds.concat(local.approvedTagIds);
    }
  }),

  approveTags(storage, tags) {
    const cu = this.get('currentUser');
    const userSettings = cu.getStorage(storage);

    userSettings.approvedTagIds = userSettings.approvedTagIds.concat(tags.mapBy('id')).filter((id, index, self) => {
      return self.indexOf(id) === index;
    });

    cu.setStorage(storage, userSettings);

    this.notifyPropertyChange('approvedTagIds');
  }
});
