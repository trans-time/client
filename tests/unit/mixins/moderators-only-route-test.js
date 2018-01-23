import EmberObject from '@ember/object';
import ModeratorsOnlyRouteMixin from 'client/mixins/moderators-only-route';
import { module, test } from 'qunit';

module('Unit | Mixin | moderators only route');

// Replace this with your real tests.
test('it works', function(assert) {
  let ModeratorsOnlyRouteObject = EmberObject.extend(ModeratorsOnlyRouteMixin);
  let subject = ModeratorsOnlyRouteObject.create();
  assert.ok(subject);
});
