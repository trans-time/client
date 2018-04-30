import EmberObject from '@ember/object';
import ModelTimelineableMixin from 'client/mixins/model-timelineable';
import { module, test } from 'qunit';

module('Unit | Mixin | model timelineable');

// Replace this with your real tests.
test('it works', function(assert) {
  let ModelTimelineableObject = EmberObject.extend(ModelTimelineableMixin);
  let subject = ModelTimelineableObject.create();
  assert.ok(subject);
});
