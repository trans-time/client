import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ImageUploadMixin from 'client/mixins/image-upload';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(ImageUploadMixin, RouteTitleMixin, {
  currentUser: service(),
  intl: service(),

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

    this.set('titleToken', this.get('intl').t('post.new'));
  }
});
