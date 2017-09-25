import Ember from 'ember';
import RouteTitleMixin from 'client/mixins/route-title';
import { module, test } from 'qunit';

module('Unit | Mixin | route title');

// Replace this with your real tests.
test('it works', function(assert) {
  let RouteTitleObject = Ember.Object.extend(RouteTitleMixin);
  let subject = RouteTitleObject.create();
  assert.ok(subject);
});
