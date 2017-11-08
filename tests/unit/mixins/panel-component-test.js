import EmberObject from '@ember/object';
import PanelComponentMixin from 'client/mixins/panel-component';
import { module, test } from 'qunit';

module('Unit | Mixin | panel component');

// Replace this with your real tests.
test('it works', function(assert) {
  let PanelComponentObject = EmberObject.extend(PanelComponentMixin);
  let subject = PanelComponentObject.create();
  assert.ok(subject);
});
