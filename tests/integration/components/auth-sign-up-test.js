import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('auth-sign-up', 'Integration | Component | auth sign up', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{auth-sign-up}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#auth-sign-up}}
      template block text
    {{/auth-sign-up}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
