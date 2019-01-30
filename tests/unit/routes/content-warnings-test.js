import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | content-warnings', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:content-warnings');
    assert.ok(route);
  });
});
