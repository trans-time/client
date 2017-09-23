import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('timeline-ui-pointer', 'Integration | Component | timeline ui pointer', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{timeline-ui-pointer}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#timeline-ui-pointer}}
      template block text
    {{/timeline-ui-pointer}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
