import Ember from 'ember';

export default Ember.Component.extend({
  modalManager: Ember.inject.service('modal-manager'),
  componentPath: Ember.computed.oneWay('modalManager.componentPath')
});
