import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('identities-form/identity', 'Integration | Component | identities form/identity', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{identities-form/identity}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#identities-form/identity}}
      template block text
    {{/identities-form/identity}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
