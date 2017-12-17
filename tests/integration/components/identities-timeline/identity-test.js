import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('identities-timeline/identity', 'Integration | Component | identities timeline/identity', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{identities-timeline/identity}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#identities-timeline/identity}}
      template block text
    {{/identities-timeline/identity}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
