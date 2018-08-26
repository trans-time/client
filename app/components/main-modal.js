import Component from '@ember/component';
import { alias, oneWay, notEmpty } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import { EKMixin, EKOnInsertMixin, keyDown } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  modalManager: service(),

  componentPath: oneWay('modalManager.componentPath'),
  keyboardFirstResponder: notEmpty('componentPath'),
  options: alias('modalManager.options'),

  _keyClose: on(keyDown('Escape'), function() {
    this.get('modalManager').close('reject');
  }),

  actions: {
    close() {
      this._keyClose();
    }
  }
});
