import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-webrtc-capture', 'Integration | Component | ember webrtc capture', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ember-webrtc-capture}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ember-webrtc-capture}}
      template block text
    {{/ember-webrtc-capture}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
