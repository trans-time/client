import EmberObject from '@ember/object';
import NotificationComponentMixin from 'client/mixins/notification-component';
import { module, test } from 'qunit';

module('Unit | Mixin | notification component');

// Replace this with your real tests.
test('it works', function(assert) {
  let NotificationComponentObject = EmberObject.extend(NotificationComponentMixin);
  let subject = NotificationComponentObject.create();
  assert.ok(subject);
});
