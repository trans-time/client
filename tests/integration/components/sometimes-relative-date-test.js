import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sometimes-relative-date', 'Integration | Component | sometimes relative date', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sometimes-relative-date}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sometimes-relative-date}}
      template block text
    {{/sometimes-relative-date}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
