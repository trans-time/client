import Component from '@ember/component';
import { observer } from '@ember/object';
import { alias, oneWay, notEmpty } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import { EKMixin, EKOnInsertMixin, keyDown } from 'ember-keyboard';
import { task, timeout } from 'ember-concurrency';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  tagName: '',

  modalManager: service(),

  componentPath: oneWay('modalManager.componentPath'),
  keyboardFirstResponder: notEmpty('componentPath'),
  options: alias('modalManager.options'),

  _keyClose: on(keyDown('Escape'), function() {
    this.get('modalManager').close('reject');
  }),

  _modalIsOpening: observer('componentPath', function() {
    this.get('disableCloseTask').perform();
  }),

  disableCloseTask: task(function * () {
    this.set('_cannotClose', true);

    yield timeout(500);

    this.set('_cannotClose', false);
  }).restartable(),

  actions: {
    close() {
      if (!this.get('_cannotClose')) this._keyClose();
    }
  }
});
