import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import { Promise, all } from 'rsvp';

export default Route.extend({
  _saveChangeset: task(function * (changeset, resolve, reject) {
    if (changeset.get('isDirty')) {
      yield changeset.save().then(resolve).catch(reject);
    } else {
      resolve();
    }
  }).maxConcurrency(3).enqueue(),

  actions: {
    submit(changesets, resolve) {
      all(changesets.map((changeset) => {
        return new Promise((resolve, reject) => {
          this.get('_saveChangeset').perform(changeset, resolve, reject);
        });
      })).then(() => {
        this.transitionTo('users.user.profile.index');
      }).finally(resolve);
    }
  }
});
