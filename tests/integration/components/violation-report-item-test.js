import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('moderation-report-item', 'Integration | Component | violation report item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{moderation-report-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#moderation-report-item}}
      template block text
    {{/moderation-report-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
