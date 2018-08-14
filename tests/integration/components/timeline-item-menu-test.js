import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('timeline-item-menu', 'Integration | Component | timeline item menu', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{timeline-item-menu}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#timeline-item-menu}}
      template block text
    {{/timeline-item-menu}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
