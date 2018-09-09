import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | email-unlock', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:email-unlock');
    assert.ok(route);
  });
});
