import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('paper-toaster-error', 'Integration | Component | paper toaster error', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{paper-toaster-error}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#paper-toaster-error}}
      template block text
    {{/paper-toaster-error}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
