import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  intl: service(),
  topBarManager: service(),

  model() {
    return this.store.createRecord('announcement');
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('announcements.new');

    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);
  },

  actions: {
    submit(model) {
      model.save();
    }
  }
});
