import Ember from 'ember';
import PanelComponentMixin from 'client/mixins/panel-component';
import { module, test } from 'qunit';

module('Unit | Mixin | panel component');

// Replace this with your real tests.
test('it works', function(assert) {
  let PanelComponentObject = Ember.Object.extend(PanelComponentMixin);
  let subject = PanelComponentObject.create();
  assert.ok(subject);
});
