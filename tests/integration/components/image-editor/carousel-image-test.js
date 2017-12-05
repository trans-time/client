import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('image-editor/carousel-image', 'Integration | Component | image editor/carousel image', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{image-editor/carousel-image}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#image-editor/carousel-image}}
      template block text
    {{/image-editor/carousel-image}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
