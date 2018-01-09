import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ImageUploadMixin from 'client/mixins/image-upload';

export default Route.extend(ImageUploadMixin, {
  currentUser: service(),
  intl: service(),
  topBarManager: service(),

  user: oneWay('currentUser.user'),

  model() {
    const user = this.get('user');

    return this.store.createRecord('post', {
      user,
      date: Date.now()
    });
  },

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('post.new');

    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);
  }
});
