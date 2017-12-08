import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['confirmation-modal'],

  modalManager: service(),

  actions: {
    cancel() {
      this.get('modalManager').close('reject');
    },

    confirm() {
      this.get('modalManager').close('resolve');
    }
  }
});
