import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ImageUploadMixin from 'client/mixins/image-upload';
import RouteTitleMixin from 'client/mixins/route-title';

export default Route.extend(ImageUploadMixin, RouteTitleMixin, {
  intl: service(),

  beforeModel(...args) {
    this._super(...args);
console.log('edit')
    this.set('titleToken', this.get('intl').t('post.edit'));
  }
});
