import EmberObject from '@ember/object';
import ModelReactableMixin from 'client/mixins/model-reactable';
import { module, test } from 'qunit';

module('Unit | Mixin | model reactable');

// Replace this with your real tests.
test('it works', function(assert) {
  let ModelReactableObject = EmberObject.extend(ModelReactableMixin);
  let subject = ModelReactableObject.create();
  assert.ok(subject);
});
