import Ember from 'ember';
import AuthenticatedActionMixin from 'client/mixins/authenticated-action';
import { module, test } from 'qunit';

module('Unit | Mixin | authenticated action');

// Replace this with your real tests.
test('it works', function(assert) {
  let AuthenticatedActionObject = Ember.Object.extend(AuthenticatedActionMixin);
  let subject = AuthenticatedActionObject.create();
  assert.ok(subject);
});
