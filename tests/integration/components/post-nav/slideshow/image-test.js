import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('post-nav/slideshow/image', 'Integration | Component | post nav/slideshow/image', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{post-nav/slideshow/image}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#post-nav/slideshow/image}}
      template block text
    {{/post-nav/slideshow/image}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
