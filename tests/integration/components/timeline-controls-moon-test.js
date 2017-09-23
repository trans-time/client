import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('timeline-controls-moon', 'Integration | Component | timeline controls moon', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{timeline-controls-moon}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#timeline-controls-moon}}
      template block text
    {{/timeline-controls-moon}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
