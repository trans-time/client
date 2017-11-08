import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  modalManager: service(),

  componentPath: oneWay('modalManager.componentPath')
});
