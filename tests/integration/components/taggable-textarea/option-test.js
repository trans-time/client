import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('taggable-textarea/option', 'Integration | Component | taggable textarea/option', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{taggable-textarea/option}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#taggable-textarea/option}}
      template block text
    {{/taggable-textarea/option}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
