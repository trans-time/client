import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  meta: service(),

  afterModel(...args) {
    this._super(...args);

    this.set('meta.title', this.get('title'));
  }
});
