import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  currentUser: service(),

  approvedCWIds: computed('currentUser.currentUserId', {
    get() {
      const cu = this.get('currentUser');
      const session = cu.getStorage(sessionStorage);
      const local = cu.getStorage(localStorage);
      
      return session.approvedCWIds.concat(local.approvedCWIds);
    }
  }),

  approveCWs(storage, cws) {
    const cu = this.get('currentUser');
    const userSettings = cu.getStorage(storage);

    userSettings.approvedCWIds = userSettings.approvedCWIds.concat(cws.mapBy('id')).filter((id, index, self) => {
      return self.indexOf(id) === index;
    });

    cu.setStorage(storage, userSettings);

    this.notifyPropertyChange('approvedCWIds');
  }
});
