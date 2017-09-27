import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('post-nav/slideshow/main', 'Integration | Component | post nav/slideshow/main', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{post-nav/slideshow/main}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#post-nav/slideshow/main}}
      template block text
    {{/post-nav/slideshow/main}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
