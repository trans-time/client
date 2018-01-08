import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  meta: service(),

  afterModel(...args) {
    this._super(...args);

    const meta = this.get('meta');

    meta.setProperties({
      title: this.get('titleToken'),
      emojiTitle: this.get('emojiTitle'),
      linkRoute: this.get('linkRoute'),
      linkModelId: this.get('linkModelId')
    });
  }
});
