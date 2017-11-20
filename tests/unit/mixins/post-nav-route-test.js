import EmberObject from '@ember/object';
import PostNavRouteMixin from 'client/mixins/post-nav-route';
import { module, test } from 'qunit';

module('Unit | Mixin | post nav route');

// Replace this with your real tests.
test('it works', function(assert) {
  let PostNavRouteObject = EmberObject.extend(PostNavRouteMixin);
  let subject = PostNavRouteObject.create();
  assert.ok(subject);
});
