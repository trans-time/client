import { moduleFor, test } from 'ember-qunit';

moduleFor('route:posts/post/faves', 'Unit | Route | posts/post/faves', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
