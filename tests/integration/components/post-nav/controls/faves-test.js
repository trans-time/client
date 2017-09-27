import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('post-nav/controls/faves', 'Integration | Component | post nav/controls/faves', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{post-nav/controls/faves}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#post-nav/controls/faves}}
      template block text
    {{/post-nav/controls/faves}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
