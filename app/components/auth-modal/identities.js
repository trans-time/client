import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { Promise, all } from 'rsvp';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['main-modal-content'],

  currentUser: service(),
  modalManager: service(),

  _saveChangeset: task(function * (changeset, resolve, reject) {
    if (changeset.get('isDirty')) {
      yield changeset.save().then(resolve).catch(reject);
    } else {
      resolve();
    }
  }).maxConcurrency(3).enqueue(),

  actions: {
    cancel() {
      this.modalManager.close('resolve');
    },

    submit(changesets, resolve) {
      all(changesets.map((changeset) => {
        return new Promise((resolve, reject) => {
          this.get('_saveChangeset').perform(changeset, resolve, reject);
        });
      })).then(() => {
        this.get('modalManager').open('auth-modal/suggestions');
      }).finally(resolve);
    }
  }
});
