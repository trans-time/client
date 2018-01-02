import EmberObject from '@ember/object';
import PostNavControllerMixin from 'client/mixins/post-nav-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | post nav controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let PostNavControllerObject = EmberObject.extend(PostNavControllerMixin);
  let subject = PostNavControllerObject.create();
  assert.ok(subject);
});
