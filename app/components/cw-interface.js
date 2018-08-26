import Component from '@ember/component';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  intl: service(),
  cwManager: service(),
  modalManager: service(),

  contentIsViewable: computed('cwManager.approvedCWIds', {
    get() {
      const approvedCWIds = this.get('cwManager.approvedCWIds');

      return this.get('content.contentWarnings').every((cw) => approvedCWIds.indexOf(cw.id) > -1);
    }
  }),

  _addCWsFor(storage) {
    const approvedCWIds = this.get('cwManager.approvedCWIds');
    const contentWarnings = this.get('content.contentWarnings');
    const maturityWarnings = ['nsfw', 'nudity', 'nude', 'mature'];

    if (contentWarnings.any((cw) => maturityWarnings.indexOf(cw.get('name').toLowerCase()) > -1  && approvedCWIds.indexOf(cw.get('id')) === -1)) {
      new Promise((resolve, reject) => {
        this.get('modalManager').open('confirmation-modal', resolve, reject, { content: this.get('intl').t('contentWarnings.confirmation') });
      }).then(() => {
        this.get('cwManager').approveCWs(storage, contentWarnings);
      });
    } else {
      this.get('cwManager').approveCWs(storage, contentWarnings);
    }
  },

  actions: {
    addCWsForSession() {
      this._addCWsFor(sessionStorage);
    },

    addCWsForAlways() {
      this._addCWsFor(localStorage);
    }
  }
});
