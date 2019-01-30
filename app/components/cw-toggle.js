import Component from '@ember/component';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  cwManager: service(),
  modalManager: service(),

  shouldHideWarnings: oneWay('cwManager.shouldHideWarnings'),

  actions: {
    showWarnings() {
      this.cwManager.showWarnings();
      this.modalManager.close('resolve');
    },

    hideWarnings() {
      this.cwManager.hideWarnings();
      this.modalManager.close('resolve');
    }
  }
});
