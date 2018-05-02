import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('nsfw-interface', 'Integration | Component | nsfw interface', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{nsfw-interface}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#nsfw-interface}}
      template block text
    {{/nsfw-interface}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
