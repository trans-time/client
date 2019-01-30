import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { Promise, all } from 'rsvp';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['main-modal-content','suggestions-modal'],

  currentUser: service(),
  modalManager: service(),

  actions: {
    done() {
      this.modalManager.close('resolve');
    }
  }
});
