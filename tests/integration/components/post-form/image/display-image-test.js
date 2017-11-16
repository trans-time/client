import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('post-form/image/display-image', 'Integration | Component | post form/image/display image', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{post-form/image/display-image}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#post-form/image/display-image}}
      template block text
    {{/post-form/image/display-image}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
