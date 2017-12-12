import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';

export default Route.extend({
  _saveChangeset: task(function * (changeset) {
    yield changeset.save();
  }).maxConcurrency(3).enqueue(),

  actions: {
    submit(changesets) {
      changesets.forEach((changeset) => {
        this.get('_saveChangeset').perform(changeset);
      });
    }
  }
});
