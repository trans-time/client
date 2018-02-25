import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'ul',
  classNames: 'paper-toaster-error',

  paperToaster: service(),
  errors: reads('paperToaster.activeToast.errors')
});
