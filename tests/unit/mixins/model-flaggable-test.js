import EmberObject from '@ember/object';
import ModelFlaggableMixin from 'client/mixins/model-flaggable';
import { module, test } from 'qunit';

module('Unit | Mixin | model flaggable');

// Replace this with your real tests.
test('it works', function(assert) {
  let ModelFlaggableObject = EmberObject.extend(ModelFlaggableMixin);
  let subject = ModelFlaggableObject.create();
  assert.ok(subject);
});
