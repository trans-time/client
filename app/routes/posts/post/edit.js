import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ImageUploadMixin from 'client/mixins/image-upload';

export default Route.extend(ImageUploadMixin, {
  intl: service(),
  topBarManager: service(),

  beforeModel(...args) {
    this._super(...args);

    const title = this.get('intl').t('post.edit');

    this.set('titleToken', title);
    this.get('topBarManager').setTitle(title);
  }
});
