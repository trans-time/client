import EmberObject from '@ember/object';
import UserIdentityDatesMixin from 'client/mixins/user-identity-dates';
import { module, test } from 'qunit';

module('Unit | Mixin | user identity dates');

// Replace this with your real tests.
test('it works', function(assert) {
  let UserIdentityDatesObject = EmberObject.extend(UserIdentityDatesMixin);
  let subject = UserIdentityDatesObject.create();
  assert.ok(subject);
});
